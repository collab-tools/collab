var config = require('config');
var req = require('request')
var authController = require('../../../../server/controller/authController');

function login() {
  const CLIENT_ID = config.get('google.client_id');
  const CLIENT_SECRET = config.get('google.client_secret');
  const PRIVATE_KEY = config.get('authentication.privateKey');
  const options = {
    url: 'https://www.googleapis.com/oauth2/v4/token',
    form: {
      refresh_token: config.get('integration_test_account.refresh_token'),
      client_secret: CLIENT_SECRET,
      client_id: CLIENT_ID,
      grant_type: 'refresh_token',
    },
  };
  let accessToken;
  let expiresIn;
  let jwtToken;
  this.api.perform(function(client, done) {
    req.post(options, (err, res, body) => {
      if (err) {
        console.error('Error refreshing tokens');
        console.error(err);
      }
      const parsedBody = JSON.parse(body);
      accessToken = parsedBody.access_token;
      expiresIn = parsedBody.expires_in;
      jwtToken = authController.get_token(PRIVATE_KEY, 'VJ0ZFPgi7', expiresIn);
      client
        .url('http://localhost:8080/')
        .execute(function(accessToken, expiresIn, jwtToken) {
          window.localStorage.setItem('google_token', accessToken);
          window.localStorage.setItem('expiry_date', expiresIn * 1000 + new Date().getTime());
          window.localStorage.setItem('jwt', jwtToken);
          return true;
        }, [accessToken, expiresIn, jwtToken], function(result) {
          this.assert.ok(result.value, 'Localstorage updated with access tokens.');
        })
        .execute(function() {
          return [
            window.localStorage.getItem('google_token'),
            window.localStorage.getItem('expiry_date'),
            window.localStorage.getItem('jwt'),
          ];
        }, [], function(result) {
          this.waitForElementVisible('.btn.btn-social.btn-google', 10000);
          this.refresh();
          this.waitForElementVisible('#task-panel', 10000);
          this.assert.visible('#task-panel', 'User is logged in');
          done();
        });
    });
  });
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
