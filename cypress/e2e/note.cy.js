
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

const getCommentForm = () => {
  return cy.get('form');
};

const getComments = () => {
  return cy.get('.comments .comment');
};

const postComment = (content) => {
  getCommentForm().find('textarea').type(content);
  getCommentForm().find('button[type="submit"]').click();
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

    it('can visit a note page', () => {
      visitNotePage(note.id);
      cy.contains(noteContent);
    });

    it('visiting the note page increments note view count', () => {
      visitNotePage(note.id);
      expectNoteViews(1);
      
      visitNotePage(note.id);
      expectNoteViews(2);
    });

    describe('loading note page', () => {
      const commentContent = 'Test comment content';

      describe('without any comments', () => {
        beforeEach(() => {
          visitNotePage(note.id);
        });

        it('sort button is not visible', () => {
          cy.get('.note-page .comments-sort-box button')
            .should('not.exist');
        });

        it('there are no comments', () => {
          cy.contains('No comments');
          cy.get('.comments').should('not.exist');
        });

        describe('after leaving a comment', () => {
          beforeEach(() => {
            postComment(commentContent);
          });

          it('comment is added to the comments list', () => {
            getComments()
              .should('have.length', 1)
              .should('to.contain', commentContent);
          });
        });
      });

      describe('with a single comment', () => {
        beforeEach(() => {
          cy.postComment(note.id, { content: commentContent });
            //.then(createdComment => {
            //  comment = createdComment;
            //});
  
          visitNotePage(note.id);
        });
  
        it('sort button is not visible', () => {
          cy.get('.note-page .comments-sort-box button')
            .should('not.exist');
        });
  
        it('there is a comment', () => {
          getComments()
            .should('have.length', 1)
            .should('to.contain', commentContent);
        });
      });

      /*
      describe('with multiple comments', () => {
        const commentContent1 = '';
        const commentContent2 = '';
        const commentContent3 = '';

        beforeEach(() => {
          cy.postComment(note.id, { content: commentContent1 });
          cy.postComment(note.id, { content: commentContent2 });
          cy.postComment(note.id, { content: commentContent3 });
        });

        /*
        TODO TEST
          - default sort
          - can sort in reverse
          - comment is added to end in asc
          - comment is added to start in desc
        /*

      });
      */
    });
  });
});
