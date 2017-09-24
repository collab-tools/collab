const binaryPath = require('puppeteer').executablePath();

module.exports = {
  src_folders: ['assets/app/teste2e/'],
  output_folder: 'reports',
  custom_commands_path: '',
  custom_assertions_path: '',
  page_objects_path: '',
  globals_path: './globals.js',

  selenium: {
    start_process: false,
  },

  test_settings: {
    default: {
      default_path_prefix: '',
      selenium_port: 9515,
      selenium_host: '127.0.0.1',
      launch_url: 'http://localhost',
      javascriptEnabled: true,
      acceptSslCerts: true,
      trustAllSSLCerficates: true,
      desiredCapabilities: {
        browserName: 'chrome',
        chromeOptions: {
          binary: binaryPath,
          args: [
            '--no-sandbox',
            '--headless',
            'start-fullscreen',
            'window-size=1280,800',
          ],
        },
      },
    },
  },
};
