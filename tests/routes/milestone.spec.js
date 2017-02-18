/* global sinon, expect, beforeEach, afterEach, it, describe, context */
import request from 'request';
import github from '../../server/controller/githubController';
import socket from '../../server/controller/socket/handlers';
import constants from '../../server/constants';
import server from '../../server/server';
import models from '../../server/data/models/modelManager';

describe('User', function() {
  beforeEach(function(done) {
    this.sandbox = sinon.sandbox.create();
    this.socketMock = this.sandbox.mock(socket);
    this.githubMock = this.sandbox.mock(github);

    models.User
      .create({
        id: 'user1',
        email: 'email1',
        github_login: 'github_login1',
      })
      .then((newUser) => {
        this.user = newUser;
        return models.Project.create({
          id: 'project1',
          github_repo_owner: 'user1',
          github_repo_name: 'repo_name',
        });
      })
      .then((newProject) => {
        this.project = newProject;
        return this.user.addProject(newProject, { role: constants.ROLE_CREATOR });
      })
      .then(() => this.project.addUser(this.user))
      .then(() => models.Milestone.create({
        id: 'milestone1',
        project_id: 'project1',
        github_number: 1,
      }))
      .then((newMilestone) => {
        this.milestone = newMilestone;
        return models.Task.create({
          id: 'task1',
          project_id: 'project1',
          milestone_id: 'milestone1',
          github_token: 'github_token1',
        });
      })
      .then((newTask) => {
        this.task = newTask;
        done();
      });
  });

  afterEach(function(done) {
    this.sandbox.restore();
    done();
  });

  context('creating milestone', function() {
    beforeEach(function(done) {
      this.payload = {
        content: 'created milestone content',
        deadline: '2016-01-01 00:00:00',
        project_id: this.project.id,
      };
      done();
    });

    it('should return 404 if user does not exist', function(done) {
      server.select('api').inject({
        method: 'POST',
        url: '/milestones',
        credentials: { user_id: 'user2', password: 'password1' },
        payload: JSON.stringify(this.payload),
      }, (res) => {
        expect(res.statusCode).to.equal(404);
        done();
      });
    });

    it('should create a local-only milestone if no github_token', function(done) {
      server.select('api').inject({
        method: 'POST',
        url: '/milestones',
        credentials: { user_id: 'user1', password: 'password1' },
        payload: JSON.stringify(this.payload),
      }, (res) => {
        expect(res.statusCode).to.equal(200);
        this.githubMock.expects('createGithubMilestone').never();
        models.Milestone
          .findOne({ where: { content: this.payload.content } })
          .then((result) => {
            expect(result).is.not.a('null');
            expect(result.content).is.equal(this.payload.content);
          });
        done();
      });
    });

    it('should create a github milestone if github_token is provided', function(done) {
      this.payload.github_token = 'github_token1';
      server.select('api').inject({
        method: 'POST',
        url: '/milestones',
        credentials: { user_id: 'user1', password: 'password1' },
        payload: JSON.stringify(this.payload),
      }, (res) => {
        expect(res.statusCode).to.equal(200);
        const githubPayload = {
          content: this.payload.content,
          deadline: this.payload.deadline,
          project_id: this.payload.project_id,
        };
        models.Milestone
          .findOne({ where: { content: this.payload.content } })
          .then((result) => {
            expect(result).is.not.a('null');
            expect(result.content).is.equal(this.payload.content);
            this.githubMock.expects('createGithubMilestone')
              .once()
              .withExactArgs(
                result.id,
                githubPayload,
                this.project.github_repo_owner,
                this.project.github_repo_name,
                this.payload.github_token
              );
          });
        done();
      });
    });
  });
});
