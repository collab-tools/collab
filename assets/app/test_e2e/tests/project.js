/* eslint-disable no-unused-expressions */
module.exports = {
  tags: ['project'],
  beforeEach: (client) => {
    const loginPage = client.page.login();
    loginPage.navigate();
    loginPage.login();
  },
  'Add project': (client) => {
    const homepage = client.page.app();
    const projectName = Math.random().toString(36).substr(2, 5);
    homepage.expect.element('@addProjectBtn').to.be.visible;
    homepage.click('@addProjectBtn').api.pause(200);
    homepage.expect.element('@projectNameInput').to.be.visible;
    homepage.setValue('@projectNameInput', projectName);
    homepage.click('@addProjectSubmitBtn').api.pause(1000);
    homepage.expect.element(`#project-${projectName}`).to.be.visible;
    client.end();
  },
};
