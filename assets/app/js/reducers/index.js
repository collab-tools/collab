import { combineReducers } from 'redux';
import milestones from './milestones';
import notifications from './notifications';
import projects from './projects';
import tasks from './tasks';
import users from './users';
import app from './app';
import alerts from './alerts';
import files from './files';
import githubRepos from './githubRepos';
import newsfeed from './newsfeed';
import search from './search';
import snackbar from './snackbar';

export default combineReducers({
  milestones,
  notifications,
  projects,
  tasks,
  users,
  alerts,
  app,
  files,
  githubRepos,
  newsfeed,
  search,
  snackbar,
});
