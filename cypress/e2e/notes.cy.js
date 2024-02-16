
beforeEach(() => {
  // make sure tables exist
  cy.resetDb();
});

describe('notes', () => {
  it('can visit notes page', () => {
    cy.visit('/notes');

    cy.contains('Notes');
  });
});