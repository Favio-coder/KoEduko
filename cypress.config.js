import { defineConfig } from "cypress";

export default defineConfig({
  allowCypressEnv: false,
  defaultCommandTimeout: 10000,
  pageLoadTimeout: 60000,
  viewportWidth: 1280,
  viewportHeight: 720,

  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL || "http://localhost:3000",
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: "cypress/support/e2e.js",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },

  component: {
    devServer: {
      framework: "vue",
      bundler: "vite",
    },
  },
});
