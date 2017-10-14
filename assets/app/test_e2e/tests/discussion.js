const projectName = Math.random().toString(36).substr(2, 5);

/* eslint-disable no-unused-expressions */
module.exports = {
  tags: ['discussion'],
  beforeEach: (client) => {
    const loginPage = client.page.login();
    loginPage.navigate();
    loginPage.login();
  },
  'Add message': (client) => {
    const homepage = client.page.app();
    homepage.addProject(projectName);
    homepage.click(`#project-${projectName}`).api.pause(500);

    homepage.click('@discussionsTab');
    homepage.waitForElementVisible('@messageInputTrigger', 2000);
    homepage.click('@messageInputTrigger');
    homepage.waitForElementVisible('@addMessageInput', 2000);
    homepage.setValue('@addMessageInput', 'new message');
    homepage.click('@addMessageSubmitBtn');
    homepage.waitForElementVisible('@messageList', 2000);
    homepage.expect.element('.message-list .message-row:last-child .message-content p')
      .text.to.equal('new message');
    client.end();
  },
  'Edit message': (client) => {
    // Edits the last message
    const editedMessageText = 'updated message';
    const homepage = client.page.app();
    homepage.waitForElementPresent(`#project-${projectName}`, 5000);
    homepage.click(`#project-${projectName}`).api.pause(500);
    homepage.click('@discussionsTab');
    homepage.waitForElementVisible('@discussionsContainer', 2000);

    // Expand message options, click "edit" button
    homepage.click('.message-list .message-row:last-child .message-options-btn');
    homepage.waitForElementVisible('@editMessageBtn', 2000);
    homepage.click('@editMessageBtn');

    // Replace message content and submit
    homepage.waitForElementVisible('@addMessageInput', 2000);
    homepage.clearValue('@addMessageInput');
    homepage.setValue('@addMessageInput', editedMessageText);
    homepage.click('@addMessageSubmitBtn').api.pause(1000);
    homepage.expect.element('.message-list .message-row:last-child .message-content p')
      .text.to.equal(editedMessageText);

    // Snackbar displays "Message edited"
    homepage.waitForElementVisible('@systemSnackbar', 2000);
    homepage.expect.element('@systemSnackbar').text.to.equal('Message edited');
    client.end();
  },
};
