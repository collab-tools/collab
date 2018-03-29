import { createSelector } from 'reselect';
import { isProjectPresent } from '../utils/collection';
import { isItemPresent } from '../utils/general';

const getMilestones = (state) => state.milestones;
const getTasks = (state) => state.tasks;
const getProjectId = (state) => state.app.current_project;
const getNewsfeeds = (state) => state.newsfeed;
const getUsers = (state) => state.users;
const getMessages = (state) => state.messages;
const getProjects = (state) => state.projects;
const getCommits = (state) => state.commits;
const getBranches = (state) => state.branches;
const getReleases = (state) => state.releases;

export const getCurrentProject = createSelector(
  [getProjects, getProjectId],
  (projects, projectId) => {
    if (isProjectPresent(projects, projectId)) {
      return projects.filter(project => project.id === projectId)[0];
    }
    return null;
  }
);

export const getProjectCommits = createSelector(
  [getCommits, getProjectId],
  (commits, projectId) => {
    let projectCommits = {};
    if (commits)
      projectCommits = commits;
  return projectCommits;
  }
);

export const getProjectBranches = createSelector(
  [getBranches, getProjectId],
  (branches, projectId) => {
    let projectBranches = [];
    if (branches) {
      projectBranches = branches;
    }
  return projectBranches;
  }
);

export const getProjectReleases = createSelector(
  [getReleases, getProjectId],
  (releases, projectId) => {
    let projectReleases = [];
    if (releases) {
      projectReleases = releases;
    }
  return projectReleases;
  }
);

export const getProjectActiveUsers = createSelector(
  [getUsers, getCurrentProject],
  (users, project) => {
    let actievUsers = [];
    if (project) {
      const basicUserIds = project.basic;
      basicUserIds.push(project.creator);
      actievUsers = users.filter(user => isItemPresent(basicUserIds, user.id));
    }
    return actievUsers;
  }
);

export const getProjectPendingUsers = createSelector(
  [getUsers, getCurrentProject],
  (users, project) => {
    let pendingUsers = [];
    if (project) {
      const pendingUserIds = project.pending;
      pendingUsers = users.filter(user => isItemPresent(pendingUserIds, user.id));
    }
    return pendingUsers;
  }
);

export const getProjectMilestones = createSelector(
  [getMilestones, getProjectId],
  (milestones, projectId) => (
    milestones.filter(milestone => milestone.project_id === projectId)
  )
);

export const getProjectTasks = createSelector(
  [getTasks, getProjectId],
  (tasks, projectId) => (tasks.filter(task => task.project_id === projectId))
);

export const getProjectEvents = createSelector(
  [getNewsfeeds, getProjectId],
  (events, projectId) => (events.filter(event => event.project_id === projectId))
);
export const getProjectMessages = createSelector(
  [getMessages, getProjectId],
  (messages, projectId) => (messages.filter(message => message.project_id === projectId))
);

// export const getActiveUsers =
