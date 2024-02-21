// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('resetDb', () => {
  cy.request('POST', `${Cypress.env('API_TESTING_URL')}/reset`);
});

Cypress.Commands.add('postNote', (values) => {
  cy.request('POST', `${Cypress.env('API_URL')}/notes`, values)
    .then(response => {
      return response.body;
    });
});

Cypress.Commands.add('postComment', (noteId, values) => {
  cy.request('POST', `${Cypress.env('API_URL')}/notes/${noteId}/comments`, values)
    .then(response => {
      return response.body;
    });
});
