
beforeEach(() => {
  // make sure tables exist
  cy.resetDb();
});

const getForm = () => cy.get('.note-form form');
const getTable = () => cy.get('.notes-table');

const postNote = (content) => {
  getForm().find('textarea').type(content);
  getForm().find('button[type="submit"]').click();
};

describe('notes', () => {
  it('can visit notes page', () => {
    cy.visit('/notes');
    cy.contains('Notes');
  });

  describe('one notes page', () => {
    beforeEach(() => {
      cy.visit('notes');
    });

    it('can post a note', () => {
      const content = 'Test content';
      postNote(content);
    });

    describe('after posting a note', () => {
      const content = 'Test content';

      beforeEach(() => {
        postNote(content);
      });

      it('note can be found from the table', () => {
        getTable().find('.note .content').should('to.contain', content);
      });

      it('textare is empty', () => {
        getForm().find('textarea').should('to.contain', '');
      });

      it('can navigate to the note page', () => {
        getTable().find('.note').first().click();
        cy.get('.note-page');
      });
    });
  });
});
