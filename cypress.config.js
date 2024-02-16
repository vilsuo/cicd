const { defineConfig } = require("cypress");

module.exports = defineConfig({
  env: {
    API_URL: 'http://localhost:3000/api',
    API_TESTING_URL: 'http://localhost:3000/api/testing',
  },
  e2e: {
    baseUrl: 'http://localhost:5173',
  },
});
