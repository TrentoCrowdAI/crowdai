const path = require('path');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.test') });

module.exports = {
  verbose: true,
  globals: {
    __base: __dirname + '/src/'
  },
  collectCoverageFrom: ['src/**/*.js'],
  globalSetup: './jest/setup.js',
  globalTeardown: './jest/teardown.js'
};
