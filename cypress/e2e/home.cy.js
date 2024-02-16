
describe('Home page', () => {
  it('can visit home page', () => {
    cy.visit('/');

    cy.contains('Home')
  });
});
