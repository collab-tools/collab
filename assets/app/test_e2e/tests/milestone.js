const projectName = Math.random().toString(36).substr(2, 5);
const milestoneName = Math.random().toString(36).substr(2, 5);
const milestoneDate = 'November 30, 2019';

/* eslint-disable no-unused-expressions */
module.exports = {
  tags: ['project'],
  beforeEach: (client) => {
    const loginPage = client.page.login();
    loginPage.navigate();
    loginPage.login();
  },
  'Add milestone': (client) => {
    const homepage = client.page.app();
    homepage.addProject(projectName);
    homepage.click(`#project-${projectName}`).api.pause(500);
    homepage.click('@addMilestoneBtn').api.pause(500);
    homepage.expect.element('@addMilestoneNameInput').to.be.visible;
    homepage.setValue('@addMilestoneNameInput', milestoneName);
    homepage.setValue('@addMilestoneDatepicker', milestoneDate);
    homepage.click('@addMilestoneSubmitBtn');

    // Milestones list shows a new row
    homepage.expect.element('.milestone-row').to.be.visible;

    // Snackbar message is displayed
    homepage.waitForElementVisible('@systemSnackbar', 2000);
    homepage.expect.element('@systemSnackbar').text.to.equal('Milestone created');
    client.end();
  },
};
