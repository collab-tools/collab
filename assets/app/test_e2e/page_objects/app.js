var config = require('config');

/* eslint-disable no-unused-expressions */
function addProject(projectName) {
  this.expect.element('@addProjectBtn').to.be.visible;
  this.click('@addProjectBtn').api.pause(200);
  this.expect.element('@projectNameInput').to.be.visible;
  this.setValue('@projectNameInput', projectName);
  this.click('@addProjectSubmitBtn').api.pause(1000);
  this.expect.element(`#project-${projectName}`).to.be.visible;
  return this;
}

function addMilestone(milestoneName, milestoneDate) {
  this.click('@addMilestoneBtn').api.pause(500);
  this.expect.element('@addMilestoneNameInput').to.be.visible;
  this.setValue('@addMilestoneNameInput', milestoneName);
  this.setValue('@addMilestoneDatepicker', milestoneDate);
  this.click('@addMilestoneSubmitBtn').api.pause(500);
  this.expect.element(`#milestone-${milestoneName}`).to.be.visible;
  return this;
}

function inviteUserToProject(email) {
  this.expect.element('@settingsTab').to.be.visible;
  this.click('@settingsTab').api.pause(500);
  this.expect.element('@inviteUserToProjectInput').to.be.visible;
  this.setValue('@inviteUserToProjectInput', email);
  this.click('@inviteUserToProjectBtn').api.pause(500);
  this.expect.element('@inviteUserToProjectSuccessAlert').to.be.visible;
  return this;
}

function acceptInvitationToProject() {
  this.expect.element('@notificationTab').to.be.visible;
  this.click('@notificationTab').api.pause(1000);
  this.expect.element('@acceptInvitationToUserBtn').to.be.visible;
  this.click('@acceptInvitationToUserBtn').api.pause(1000);
  this.waitForElementVisible('@systemSnackbar', 2000);
  this.expect.element('@systemSnackbar').text.to.equal('Project accepted');
  return this;
}
 
const projectCommands = {
  addProject,
  addMilestone,
  inviteUserToProject,
  acceptInvitationToProject,
};

module.exports = {
  url: 'http://localhost:8080/',
  commands: [projectCommands],
  elements: {
    loginBtn: '.btn.btn-social.btn-google',
    systemSnackbar: '.system-snackbar',
    systemSnackbarMessage: '.system-snackbar > div > div > span',
    notificationTab: '.row > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3)',

    // Projects
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

    // Milestones
    addMilestoneBtn: '.add-milestone-btn',
    addMilestoneNameInput: '.add-milestone-name-input > input',
    addMilestoneDatepicker: '.add-milestone-datepicker input',
    addMilestoneSubmitBtn: '.add-milestone-modal-actions > button:nth-child(2)',

    // Tasks
    addTaskBtn: '.add-task-btn',
    addTaskSubmitBtn: '.add-task-submit-btn',
    addTaskNameInput: '.add-task-name-input textarea[name="Task name"]',
    addTaskMilestoneSelect: '.add-task-milestone-select',
    addTaskAssigneeSelect: '.add-task-assignee-select',

    // Files
    setRootFolderBtn: '.project-tabs > div:nth-child(2) > div:nth-child(1) > div:nth-child(3) > div:nth-child(1)',
    driveCreateBtn: '.drive-create-button',
    createNewFolderBtn: 'body > div:nth-child(5) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1)',
    uploadNewFileBtn: 'body > div:nth-child(5) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2)',
    newFolder: 'tr.table-row-file:nth-child(1) > td:nth-child(1) > div:nth-child(1) > div:nth-child(2) > span:nth-child(1)',

    // Messages
    discussionsContainer: '.discussions-container',
    messageInputTrigger: '.message-input-trigger > input',
    addMessageInput: '.add-message-input',
    addMessageSubmitBtn: '.add-message-submit-btn',
    addMessageCancelBtn: '.add-message-cancel-btn',
    messageList: '.message-list',
    messageListToggleBtn: '.message-list-toggle-btn',
    messageActivityToggleBtn: '.message-activity-toggle-btn',
    lastMessage: '.message-list .message-row:last-child',
    pinnedMessage: '.message-list .pinned.message-row',
    pinMessageBtn: '.pin-message-btn',
    unpinMessageBtn: '.unpin-message-btn',
    editMessageBtn: '.edit-message-btn',
    deleteMessageBtn: '.delete-message-btn',

    // Settings
    inviteUserToProjectInput: '.project-tabs > div:nth-child(5) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > form:nth-child(2) > span:nth-child(2) > input:nth-child(1)',
    inviteUserToProjectBtn: '.project-tabs > div:nth-child(5) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(3) > form:nth-child(2) > span:nth-child(2) > span:nth-child(2) > button:nth-child(1)',
    inviteUserToProjectSuccessAlert: '.alert',
    acceptInvitationToUserBtn: '.main-content > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > button:nth-child(2)'
  },
};
