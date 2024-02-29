import noteFinder from '../../src/middleware/noteFinder';
import * as noteService from '../../src/service/noteService';
import { ParseError } from '../../src/util/error';
import { NextFunction, Request, Response } from 'express';
import { NoteDto } from '../../src/types';
import { COMMENT, NOTE } from '../constants';

const findNoteWithCommentsSpy = jest.spyOn(noteService, 'findNoteWithComments');

const next: NextFunction = jest.fn();

const response: Partial<Response> = {
  status: jest.fn().mockReturnThis(), // chaining
  send: jest.fn(),
};

const callNoteFinder = async (request: Partial<Request>, cb: NextFunction) => {
  await noteFinder(request as Request, response as Response, cb);
};

const createRequest = (id: string): Partial<Request> => ({ params: { id } });

describe('noteFinder', () => {
  const idString = '1';
  let request: Partial<Request>;

  describe('when noteService does not throw', () => {
    beforeEach(() => {
      request = createRequest(idString);
    });

    afterEach(() => {
      expect(findNoteWithCommentsSpy).toHaveBeenCalledWith(idString);
    });

    describe('when a note is found', () => {
      describe('without any Comments', () => {
        const noteEmptyComments: NoteDto = {
          ...NOTE,
          comments: [],
        };

        beforeEach(async () => {
          findNoteWithCommentsSpy.mockImplementationOnce(
            async () => Promise.resolve(noteEmptyComments)
          );
          await callNoteFinder(request, next);
        });
  
        test('note is attached to request', () => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { comments: _, ...noteWithoutComment } = request.note;
          expect(noteWithoutComment.dataValues).toStrictEqual(NOTE.dataValues);
        });

        test('request note comments array is empty', () => {
          const { comments } = request.note;
          expect(comments).toHaveLength(0);
        });
  
        test('callback is called', () => {
          expect(next).toHaveBeenCalled();
        });
      });

      describe('with a Comment', () => {
        const noteWithAComment: NoteDto = {
          ...NOTE,
          comments: [COMMENT],
        };

        beforeEach(async () => {
          findNoteWithCommentsSpy.mockImplementationOnce(
            async () => Promise.resolve(noteWithAComment)
          );
          await callNoteFinder(request, next);
        });
  
        test('note is attached to request', () => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { comments: _, ...noteWithoutComment } = request.note;
          expect(noteWithoutComment.dataValues).toStrictEqual(NOTE.dataValues);
        });

        // tested with all comment attributes
        test('request note has a comment in the comments array', () => {
          const { comments } = request.note;
          expect(comments).toHaveLength(1);
          expect(comments[0].dataValues).toStrictEqual(COMMENT.dataValues);
        });
  
        test('callback is called', () => {
          expect(next).toHaveBeenCalled();
        });
      });
    });

    describe('when a note is not found', () => {
      beforeEach(async () => {
        // mock note not found by returning null
        findNoteWithCommentsSpy.mockImplementationOnce(() => null);
        await callNoteFinder(request, next);
      });

      test('note is not attached to request', () => {
        expect(request).not.toHaveProperty('note');
      });

      test('callback is not called', () => {
        expect(next).not.toHaveBeenCalled();
      });

      test('response code is set to 404', () => {
        expect(response.status).toHaveBeenCalledWith(404);
      });

      test('response message is set', () => {
        expect(response.send).toHaveBeenCalledWith(
          expect.objectContaining({
            message: 'Note does not exist'
          })
        );
      });
    });
  });

  test('next middleware is not called when noteService throws an Error', async () => {
    request = createRequest(idString);

    findNoteWithCommentsSpy.mockImplementationOnce(() => {
      throw new ParseError('some error');
    });

    await expect(async () => await callNoteFinder(request, next))
      .rejects.toThrow(ParseError);

    expect(findNoteWithCommentsSpy).toHaveBeenCalledWith(idString);

    expect(next).not.toHaveBeenCalled();
  });
});
