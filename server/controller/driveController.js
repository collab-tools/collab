var Boom = require('boom');
var constants = require('../constants');
var storage = require('../data/storage');
var req = require("request");

module.exports = {
  givePermissions: {
    handler: givePermissions,
  },
  createPermissions,
};

function givePermissions(request, reply) {
  var userId = request.auth.credentials.user_id
  var fileId = request.params.file_id
  var projectId = request.payload.project_id
  var googleToken = request.payload.google_token
  createPermissions(userId, projectId, fileId, googleToken);
  reply({ status: constants.STATUS_OK });
}

function createPermissions(userId, projectId, fileId, googleToken) {
  if (fileId) {
    storage.findUserById(userId).then(function (owner) {
      storage.getProjectsOfUser(userId).then(function (projects) {
        var matchingProjects = projects.filter(function (project) {
          return project.id === projectId;
        })

        if (matchingProjects.length !== 1) {
          return;
        }

        storage.getUsersOfProject(projectId).then(function (members) {
          members.forEach(function (user) {
            if (user.id != userId) {
              var options = {
                url: `https://www.googleapis.com/drive/v3/files/${fileId}/permissions`,
                headers: {
                  Authorization: `Bearer ${googleToken}`,
                },
                body: {
                  role: 'writer',
                  type: 'user',
                  emailAddress: `${user.email}`,
                },
                json: true,
              }
              req.post(options, function (error, res, body) {
                if (error) {
                  console.error(error);
                }
              });
            }
          });
        });
      });
    });
  }
}
