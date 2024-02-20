const noteFinder = require('../../src/middleware/noteFinder');
const parser = require('../../src/util/parser');
const { Note, Comment } = require('../../src/model');
const ParseError = require('../../src/util/error');

const parseIdSpy = jest.spyOn(parser, 'parseId');

const findNoteSpy = jest.spyOn(Note, 'findByPk');

const next = jest.fn();

const note = {
  id: 1,
  content: 'Initial note',
  views: 5,
  createdAt: '2024-02-11T23:14:44.770Z'
};

const comment = {
  id: 2,
  content: 'Comment to the note',
  createdAt: '2024-02-20T15:32:55.770Z',
  noteId: 1,
};

const callNoteFinder = async (request, cb) => {
  const response = { data: {} };

  response.status = (code) => { 
    response.code = code; 
    return response;
  };

  response.send = (body) => { 
    response.body = body; 
    return response;
  };

  response.getCode = () => response.code;
  response.getMessage = () => response.body.message;

  return await noteFinder(request, response, cb);
};

/**
 * 
 * @param {string} id 
 * @returns 
 */
const createRequest = (id) => ({ params: { id } });

describe('noteFinder', () => {
  describe('valid id', () => {
    const idString = '1';
    const idNumber = 1;

    beforeEach(async () => {
      parseIdSpy.mockImplementationOnce(() => idNumber);
    });

    afterEach(() => {
      expect(parseIdSpy).toHaveBeenCalledWith(idString);

      expect(findNoteSpy).toHaveBeenCalledWith(
        idNumber, // correct Note

        // Comment model is attached without noteId
        { 
          include: { 
            model: Comment, 
            attributes: { exclude: ['noteId'] } 
          },
        },
      );
    });

    describe('existing Note', () => {
      let request;

      describe('without any Comments', () => {
        const noteWithComments = { ...note, comments: [] };

        beforeEach(async () => {
          request = createRequest(idString);
          findNoteSpy.mockImplementationOnce(async () => noteWithComments);
          await callNoteFinder(request, next);
        });
  
        test('note is attached to request', () => {
          // eslint-disable-next-line no-unused-vars
          const { comments, ...noteWithoutComment } = request.note;
          expect(noteWithoutComment).toStrictEqual(note);
        });

        test('note comments array is empty', () => {
          const { comments } = request.note;
          expect(comments).toHaveLength(0);
        });
  
        test('callback is called', () => {
          expect(next).toHaveBeenCalled();
        });
      });

      describe('with a Comment', () => {
        // eslint-disable-next-line no-unused-vars
        const { noteId, ...commentNoNoteId } = comment;

        beforeEach(async () => {
          request = createRequest(idString);

          // afterEach tests that Comment is attached without noteId
          findNoteSpy.mockImplementationOnce(async () => {
            return { ...note, comments: [commentNoNoteId] };
          });

          await callNoteFinder(request, next);
        });
  
        test('note is attached to request', () => {
          // eslint-disable-next-line no-unused-vars
          const { comments, ...noteWithoutComment } = request.note;
          expect(noteWithoutComment).toStrictEqual(note);
        });

        test('note has a comment in comments array', () => {
          const { comments } = request.note;
          expect(comments).toHaveLength(1);
          expect(comments[0]).toBe(commentNoNoteId);
        });
  
        test('callback is called', () => {
          expect(next).toHaveBeenCalled();
        });
      });
    });

    describe('non-existing Note', () => {
      let request;
      let response;

      beforeEach(async () => {
        request = createRequest(idString);
        findNoteSpy.mockImplementationOnce(async () => undefined);
        response = await callNoteFinder(request, next);
      });

      test('note is not attached to request', () => {
        expect(request).not.toHaveProperty('note');
      });

      test('callback is not called', () => {
        expect(next).not.toHaveBeenCalled();
      });

      test('response code is 404', () => {
        expect(response.getCode()).toBe(404);
      });

      test('response message is set', () => {
        expect(response.getMessage()).toMatch(/Note does not exist/i);
      });
    });
  });

  test('invalid id throws an Error', async () => {
    const idInvalid = 'abc';
    const request = createRequest(idInvalid);

    // mock parser to throw an Error
    parseIdSpy.mockImplementationOnce(() => { throw new ParseError(); });

    await expect(async () => await callNoteFinder(request, next))
      .rejects.toThrow(ParseError);

    expect(parseIdSpy).toHaveBeenCalledWith(idInvalid);
    expect(findNoteSpy).not.toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });
});
