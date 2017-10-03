const projectName = Math.random().toString(36).substr(2, 5);
const milestoneName = Math.random().toString(36).substr(2, 5);
const milestoneDate = 'November 30, 2019';
const newMilestoneName = Math.random().toString(36).substr(2, 5);

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
    homepage.click('@addMilestoneSubmitBtn').api.pause(500);

    // Milestones list shows a new row
    homepage.expect.element(`#milestone-${milestoneName}`).to.be.visible;

    // Snackbar message is displayed
    homepage.waitForElementVisible('@systemSnackbar', 2000);
    homepage.expect.element('@systemSnackbar').text.to.equal('Milestone created');
    client.end();
  },
  'Edit milestone': (client) => {
    const homepage = client.page.app();
    homepage.waitForElementVisible(`#project-${projectName}`, 2000);
    homepage.click(`#project-${projectName}`).api.pause(500);
    homepage.expect.element(`#milestone-${milestoneName} .milestone-title > span`).to.be.visible;
    homepage.moveToElement(`#milestone-${milestoneName} .milestone-title > span`, 3, 3);
    homepage.api.pause(100);
    homepage.click(`#milestone-${milestoneName} .milestone-actions .edit-task`).api.pause(500);
    homepage.setValue('@addMilestoneNameInput', newMilestoneName);
    homepage.click('@addMilestoneSubmitBtn');

    // Snackbar displays "Milestone updated"
    homepage.waitForElementVisible('@systemSnackbar', 2000);
    homepage.expect.element('@systemSnackbar').text.to.equal('Milestone updated');
    client.end();
  },
};
