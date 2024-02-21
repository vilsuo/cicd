
beforeEach(() => {
  // make sure tables exist
  cy.resetDb();
});

const visitNotePage = (noteId) => {
  cy.intercept('GET', '/api/notes/*').as('getNote');
  cy.visit(`/notes/${noteId}`);
  cy.wait('@getNote');
};

const getNote = () => cy.get('.note-page .note');

const expectNoteViews = (views) => {
  getNote()
    .find('.details span')
    .contains('Views')
    .then(function ($span) {
      const text = $span.text();
      expect(text).to.match(new RegExp(`^${views} Views$`));
    });
};

const getSortButton = () => {
  cy.get('.note-page .comments-sort-box button');
};

describe('note', () => {
  it('can not visit non-existing note page', () => {
    const noteId = 1234;
    visitNotePage(noteId);

    cy.get('#error-page').should('to.contain', '404');
  });

  describe('when note exists', () => {
    const noteContent = 'Test note content';
    let note;

    beforeEach(() => {
      cy.postNote({ content: noteContent })
        .then(createdNote => {
          note = createdNote;
        });
    });

    describe('without any comments', () => {
      it('can visit a note page', () => {
        visitNotePage(note.id);
        cy.contains(noteContent);
      });

      describe('on note page', () => {
        beforeEach(() => {
          visitNotePage(note.id);
        });

        it('visiting the note page increments note view count', () => {
          expectNoteViews(1);
          visitNotePage(note.id);
          expectNoteViews(2);
        });

        it('sort button is not visible', () => {
          cy.get('.note-page .comments-sort-box button')
            .should('not.exist');
        });

        it('there are no comments', () => {
          cy.contains('No comments');
          cy.get('.comments').should('not.exist');
        });
      });
    });

    describe('with a comment', () => {
      const commentContent = 'Test comment content';
      let comment;

      beforeEach(() => {
        cy.postComment(note.id, { content: commentContent })
          .then(createdComment => {
            comment = createdComment;
          });

        visitNotePage(note.id);
      });

      it('sort button is not visible', () => {
        cy.get('.note-page .comments-sort-box button')
          .should('not.exist');
      });

      it('there is a comment', () => {
        cy.get('.comments .comment')
          .should('have.length', 1)
          .should('to.contain', commentContent);
      });
    });
  });
});
