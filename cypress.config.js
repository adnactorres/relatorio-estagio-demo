const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    // Sem baseUrl: o Cypress serve os arquivos da raiz do projeto,
    // então cy.visit("index.html") abre a demo sem precisar de servidor.
    specPattern: "cypress/e2e/**/*.cy.js",
    supportFile: "cypress/support/e2e.js",
    viewportWidth: 1280,
    viewportHeight: 900,
    defaultCommandTimeout: 8000,
    video: false,
    screenshotOnRunFailure: true,
    retries: { runMode: 1, openMode: 0 },
  },
});
