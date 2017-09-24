var config = require('config');

function login() {
  const testUsername = config.get('integration_test_account.username');
  const testPassword = config.get('integration_test_account.password');
  this.click('@loginBtn').api.pause(1000);
  this.api.windowHandles((result) => {
    this.verify.equal(result.value.length, 2, 'There should be 2 windows open');
    const newWindow = result.value[1];
    this.api.switchWindow(newWindow);
  })
  .waitForElementVisible('input[type="email"]', 1000)
  .setValue('input[type="email"]', testUsername)
  .sendKeys('input[type="email"]', this.api.Keys.ENTER)
  .waitForElementVisible('input[type="password"]', 1000)
  .setValue('input[type="password"]', testPassword)
  .sendKeys('input[type="password"]', this.api.Keys.ENTER)
  .pause(1000)
  .windowHandles((result) => {
    this.assert.equal(result.value.length, 1, 'There should be only one window open.');
    this.api.switchWindow(result.value[0]);
  })
  .waitForElementVisible('#task-panel', 5000);
  return this;
}

const loginCommands = {
  login,
};

module.exports = {
  url: 'http://localhost:8080/',
  commands: [loginCommands],
  elements: {
    loginBtn: '.btn.btn-social.btn-google',
  },
};
