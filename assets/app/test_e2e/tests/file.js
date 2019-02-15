const projectName = Math.random().toString(36).substr(2, 5);
const config = require('config');

/* eslint-disable no-unused-expressions */
module.exports = {
  tags: ['discussion'],
  beforeEach: (client) => {
    const loginPage = client.page.login();
    loginPage.navigate();
    loginPage.loginAsGoogleUser();
  },
  'Create a Folder Multi User': (client) => {
    var homepage = client.page.app();
    const email = config.get('integration_test_google_account_2.email');
    var fileCount;

    homepage.addProject(projectName);
    homepage.click(`#project-${projectName}`).api.pause(1000);

    homepage.inviteUserToProject(email);

    // log out
    client.click('.headerIconMenu').pause(1000);
    client.click('#logoutBtn').pause(500);

    var loginPage = client.page.login();
    loginPage.navigate();
    loginPage.loginAsGoogleUser2();
    homepage = client.page.app();

    homepage.acceptInvitationToProject();

    homepage.click(`#project-${projectName}`);
    homepage.waitForElementVisible('@filesTab', 2000);
    homepage.click('@filesTab');
    homepage.waitForElementVisible('@setRootFolderBtn', 2000);
    homepage.click('@setRootFolderBtn');
    homepage.waitForElementVisible('@driveCreateBtn', 2000);
    homepage.click('@driveCreateBtn');
    homepage.waitForElementVisible('@createNewFolderBtn', 2000);
    homepage.click('@createNewFolderBtn').api.pause(1000);
    client.elements('css selector', 'tr.table-row-file', function (result) {
      fileCount = result.value.length;
    });

    // log out
    client.click('.headerIconMenu').pause(1000);
    client.click('#logoutBtn').pause(500);

    loginPage = client.page.login();
    loginPage.navigate();
    loginPage.loginAsGoogleUser();
    homepage = client.page.app();

    homepage.click(`#project-${projectName}`);
    homepage.waitForElementVisible('@filesTab', 2000);
    homepage.click('@filesTab').api.pause(1000);
    client.elements('css selector', 'tr.table-row-file', function (result) {
      this.assert.equal(result.value.length, fileCount);
    });

    client.end();
  }
}