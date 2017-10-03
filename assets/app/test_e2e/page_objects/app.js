var config = require('config');

module.exports = {
  url: 'http://localhost:8080/',
  commands: [],
  elements: {
    loginBtn: '.btn.btn-social.btn-google',
    addProjectBtn: '.add-project-icon',
    projectNameInput: 'input[name="Project name"]',
    addProjectSubmitBtn: '.add-project-modal-actions > button:nth-child(2)',
    milestonesTab: '.project-milestones-tab',
    filesTab: '.project-files-tab',
    discussionsTab: '.project-discussions-tab',
    newsfeedTab: '.project-newsfeed-tab',
    settingsTab: '.project-settings-tab',
    emptyMilestonesMessage: '.task-list > .no-items',
    renameProjectInput: '.rename-project-input',
    renameProjectBtn: '.rename-project-btn',
  },
};
