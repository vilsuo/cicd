
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

const getSortButton = () => cy.get('.note-page .comments-sort-box button');

const expectButtonAscending = () => getSortButton().should('to.contain', 'Oldest');

const expectButtonDescending = () => {
  getSortButton().should('to.contain', 'Latest');
};

const getCommentForm = () => cy.get('form');

const getComments = () => cy.get('.comments .comment');

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

      describe('with multiple comments', () => {
        const commentContent1 = 'first';
        const commentContent2 = 'second';
        const commentContent3 = 'third';

        beforeEach(() => {
          cy.postComment(note.id, { content: commentContent1 });
          cy.postComment(note.id, { content: commentContent2 });
          cy.postComment(note.id, { content: commentContent3 });

          visitNotePage(note.id);
        });

        it('sort button is visible', () => {
          getSortButton();
        });

        describe('order of comments', () => {
          const newCommentContent = 'fourth';

          it('default order is ascending by creation date', () => {
            expectButtonAscending();

            getComments().eq(0).should('to.contain', commentContent1);
            getComments().eq(1).should('to.contain', commentContent2);
            getComments().eq(2).should('to.contain', commentContent3);
          });

          it('creating a new comment with default sort order places it the end', () => {
            postComment(newCommentContent);
            getComments().eq(3).should('to.contain', newCommentContent);
          });

          describe('sorting descending by creation date', () => {
            beforeEach(() => {
              getSortButton().click();
            });

            it('can sort descending by creation date', () => {
              expectButtonDescending();

              getComments().eq(2).should('to.contain', commentContent1);
              getComments().eq(1).should('to.contain', commentContent2);
              getComments().eq(0).should('to.contain', commentContent3);
            })

            it('when creating a new comment it is placed in the beginning', () => {
              postComment(newCommentContent);
              getComments().eq(0).should('to.contain', newCommentContent);
            });
          });
        });
      });
    });
  });
});
