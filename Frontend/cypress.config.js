import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: 'http://127.0.0.1:5173/', 
    supportFile: 'cypress/support/e2e.js', 
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',     
    setupNodeEvents(on, config)   {
    },
  },
  env: {
    apiUrl: 'http://localhost:3000/api', 
  },
  video: false, 
});
