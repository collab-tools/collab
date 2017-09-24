/* eslint-disable no-unused-expressions */
module.exports = {
  tags: ['login'],
  'Login test': (client) => {
    const loginPage = client.page.login();
    loginPage.navigate();
    loginPage.expect.element('body').to.be.present;
    loginPage.expect.element('#task-panel').to.not.be.present;
    loginPage.expect.element('@loginBtn').to.be.visible;
    loginPage.click('@loginBtn').api.pause(1000);
    loginPage.expect.element('.login-btn-text').text.to.contain('Logging in...');
    loginPage.login();
    // client.windowHandles((result) => {
    //   client.verify.equal(result.value.length, 2, 'There should be 2 windows open');
    //   const newWindow = result.value[1];
    //   client.switchWindow(newWindow);
    //   client.expect.element('input[type="email"]').to.be.present;
    // })
    // .waitForElementVisible('input[type="email"]', 1000)
    // .setValue('input[type="email"]', testUsername)
    // .sendKeys('input[type="email"]', client.Keys.ENTER)
    // .waitForElementVisible('input[type="password"]', 1000)
    // .setValue('input[type="password"]', testPassword)
    // .sendKeys('input[type="password"]', client.Keys.ENTER)
    // .pause(1000)
    // .windowHandles((result) => {
    //   client.assert.equal(result.value.length, 1, 'There should be only one window open.');
    //   client.switchWindow(result.value[0]);
    // })
    // .waitForElementVisible('#task-panel', 3000);
    client.end();
  },
};
