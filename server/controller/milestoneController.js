var constants = require('../constants');
var storage = require('../data/storage');
var format = require('string-format');
var Joi = require('joi');
var Boom = require('boom');
var moment = require('moment');
var accessControl = require('./accessControl');
var socket = require('./socket/handlers');
var helper = require('../utils/helper');
var config = require('config');
var camelcaseKeys = require('camelcase-keys');
var assign = require('object-assign');
var github = require('./githubController')
var analytics = require('collab-analytics')(config.database, config.logging_database);

module.exports = {
    createMilestone: {
        handler: createMilestone,
        payload: {
            parse: true
        }
    },
    updateMilestone: {
        handler: updateMilestone,
        payload: {
            parse: true
        }
    },
    removeMilestone: {
        handler: deleteMilestone,
        payload: {
            parse: true
        }
    }
};

function updateMilestone(request, reply) {
    var milestone_id = request.params.milestone_id;
    var token = request.payload.github_token
    var user_id = request.auth.credentials.user_id
    var milestone = {}
    if (request.payload.content) {
        milestone.content = request.payload.content
    }
    if ('deadline' in request.payload) {
        milestone.deadline = request.payload.deadline ? request.payload.deadline : null // convert empty string to null
    }

    storage.findProjectOfMilestone(milestone_id).then(function(result) {
        var project = result.project
        var github_num = result.milestone.github_number

        accessControl.isUserPartOfProject(user_id, project.id).then(function (isPartOf) {
            if (!isPartOf) {
                reply(Boom.forbidden(constants.FORBIDDEN));
                return;
            }
            var originalMilestoneValues = assign({}, result.milestone.get());
            result.milestone.update(milestone).then(function(m) {
                analytics.milestone.logMilestoneActivity(
                    analytics.milestone.constants.ACTIVITY_UPDATE,
                    moment().format('YYYY-MM-DD HH:mm:ss'),
                    user_id,
                    camelcaseKeys(result.milestone.toJSON())
                )
                storage.findUserById(user_id).then(function(user) {
                  var updatedMilestoneValues = result.milestone.get();
                  if (originalMilestoneValues.content !== updatedMilestoneValues.content) {
                    storage.createSystemMessage(updatedMilestoneValues.project_id, updatedMilestoneValues.id,
                    constants.systemMessageTypes.EDIT_MILESTONE_CONTENT, {
                      user: {
                        id: user.id,
                        display_name: user.display_name,
                      },
                      milestone: {
                        id: updatedMilestoneValues.id,
                        originalContent: originalMilestoneValues.content,
                        updatedContent: updatedMilestoneValues.content
                      },
                    }).then(function(message) {
                      socket.sendAddDiscussionMessageToProject(updatedMilestoneValues.project_id, message)
                    });
                  }
                  if (originalMilestoneValues.deadline !== updatedMilestoneValues.deadline) {
                    storage.createSystemMessage(updatedMilestoneValues.project_id, updatedMilestoneValues.id,
                    constants.systemMessageTypes.EDIT_MILESTONE_DEADLINE, {
                      user: {
                        id: user.id,
                        display_name: user.display_name,
                      },
                      milestone: {
                        id: updatedMilestoneValues.id,
                        content: updatedMilestoneValues.content,
                        originalDeadline: originalMilestoneValues.deadline,
                        updatedDeadline: updatedMilestoneValues.deadline
                      },
                    }).then(function(message) {
                      socket.sendAddDiscussionMessageToProject(updatedMilestoneValues.project_id, message)
                    });
                  }

                });
                socket.sendMessageToProject(project.id, 'update_milestone', {
                    milestone: milestone, sender: user_id, milestone_id: milestone_id
                })
                reply(milestone);

                if (!token) return

                // Add the same milestone to github milestones
                var owner = project.github_repo_owner
                var repo = project.github_repo_name
                var payload = {title: request.payload.content}
                // make sure due_on is null and not empty string
                if ('deadline' in request.payload && !request.payload.deadline){
                    payload.due_on = null
                } else if ('deadline' in request.payload) {
                    payload.due_on = request.payload.deadline
                }
                github.updateGithubMilestone(owner, repo, token, github_num, payload).then(function(){}, function (err) {
                    console.log(err)
                })

            }, function(error) {
                reply(Boom.internal(error));
            });
        })
    }).catch(() => {
        reply(Boom.badRequest(format(constants.MILESTONE_NOT_EXIST, milestone_id)));
    });
}

function createMilestone(request, reply) {
    var milestone = {
        content: request.payload.content,
        deadline: request.payload.deadline ? request.payload.deadline : null, // convert empty string to null
        project_id: request.payload.project_id
    };

    var user_id = request.auth.credentials.user_id

    storage.getProjectsOfUser(user_id).then(function(projects) {
        var currentProject = null
        var matchingProjects = projects.filter(function (project) {
            return project.id === request.payload.project_id
        })
        if (matchingProjects.length !== 1) {
            reply(Boom.forbidden(constants.FORBIDDEN));
            return
        } else {
            currentProject = matchingProjects[0]
        }

        storage.createMilestone(milestone).then(function(m) {
            analytics.milestone.logMilestoneActivity(
                analytics.milestone.constants.ACTIVITY_CREATE,
                moment().format('YYYY-MM-DD HH:mm:ss'),
                user_id,
                camelcaseKeys(m.toJSON())
            )
            storage.findUserById(user_id).then(function(user) {
              storage.createSystemMessage(m.project_id, m.id,
              constants.systemMessageTypes.CREATE_MILESTONE, {
                user: {
                  id: user.id,
                  display_name: user.display_name,
                },
                milestone: {
                  id: m.id,
                  content: m.content,
                },
              }).then(function(message) {
                socket.sendAddDiscussionMessageToProject(m.project_id, message)
              }, function(err) {
                console.error('store fail to create message');
                console.error(err);
              });
            });


            socket.sendMessageToProject(request.payload.project_id, 'new_milestone', {
                milestone: m, sender: user_id
            })
            reply(m);
            if (!request.payload.github_token) return

            // Add the same milestone to github milestones
            var owner = currentProject.github_repo_owner
            var repo = currentProject.github_repo_name
            var payload = {
                title: milestone.content,
                due_on: milestone.deadline
            }
            github.createGithubMilestone(m.id, payload, owner, repo, request.payload.github_token)

        }, function(error) {
            reply(Boom.internal(error));
        }); //storage.createMilestone

    }).catch(function(err) {
        reply(Boom.notFound(err));
    }) // getProjectsOfUser
}

function deleteMilestone(request, reply) {
    var milestone_id = request.params.milestone_id;
    var token = request.payload.github_token
    var user_id = request.auth.credentials.user_id

    storage.findProjectOfMilestone(milestone_id).then(function(result) {
        var project = result.project
        var milestone = result.milestone

        accessControl.isUserPartOfProject(user_id, project.id).then(function (isPartOf) {
            if (!isPartOf) {
                reply(Boom.forbidden(constants.FORBIDDEN));
                return;
            }

            storage.deleteMilestone(milestone_id).then(function() {
                reply({status: constants.STATUS_OK});

                analytics.milestone.logMilestoneActivity(
                  analytics.milestone.constants.ACTIVITY_DELETE,
                  moment().format('YYYY-MM-DD HH:mm:ss'),
                  user_id,
                  { projectId: project.id, id: milestone_id}
                )
                storage.findUserById(user_id).then(function(user) {
                  storage.createSystemMessage(milestone.project_id, null,
                  constants.systemMessageTypes.DELETE_MILESTONE, {
                    user: {
                      id: user.id,
                      display_name: user.display_name,
                    },
                    milestone: {
                      id: milestone.id,
                      content: milestone.content,
                    },
                  }).then(function(message) {
                    socket.sendAddDiscussionMessageToProject(milestone.project_id, message)
                  });
                });

                socket.sendMessageToProject(project.id, 'delete_milestone', {
                    milestone_id: milestone_id, sender: user_id
                })
                if (!token) return
                github.deleteGithubMilestone(project.github_repo_owner, project.github_repo_name, token, milestone.github_number)
            });
        })
    }).catch(function(err) {
        reply(Boom.badRequest(format(constants.MILESTONE_NOT_EXIST, milestone_id)));
    });
}
