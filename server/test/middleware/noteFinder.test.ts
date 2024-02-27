import noteFinder from '../../src/middleware/noteFinder';
import * as noteService from '../../src/service/noteService';
import { Note, Comment } from '../../src/model';
import { ParseError } from '../../src/util/error';
import { NextFunction, Request, Response } from 'express';
import { Attributes } from 'sequelize';
import { NoteDto } from '../../src/types';
import { commentAttr, noteAttr } from '../constants';

const findNoteWithCommentsSpy = jest.spyOn(noteService, 'findNoteWithComments');

const next: NextFunction = jest.fn();

const note: Required<Note> = Note.build(noteAttr);

const comment = Comment.build(commentAttr);

const response: Partial<Response> = {
  status: jest.fn().mockReturnThis(), // chaining
  send: jest.fn(),
};

const callNoteFinder = async (request: Partial<Request>, cb: NextFunction) => {
  await noteFinder(request as Request, response as Response, cb);
};

const createRequest = (id: any): Partial<Request> => ({ params: { id } });

describe('noteFinder', () => {
  const id = 1;
  let request: Partial<Request>;

  describe('when noteService does not throw', () => {
    beforeEach(async () => {
      request = createRequest(id);
    });

    afterEach(() => {
      expect(findNoteWithCommentsSpy).toHaveBeenCalledWith(id);
    });

    describe('when a note is found', () => {
      describe('without any Comments', () => {
        const noteEmptyComments: NoteDto = {
          ...note,
          comments: [],
        };

        beforeEach(async () => {
          findNoteWithCommentsSpy.mockImplementationOnce(async () => noteEmptyComments);
          await callNoteFinder(request, next);
        });
  
        test('note is attached to request', () => {
          const { comments: _, ...noteWithoutComment } = request.note;
          expect(noteWithoutComment.dataValues).toStrictEqual(note.dataValues);
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
          ...note,
          comments: [comment],
        };

        beforeEach(async () => {
          findNoteWithCommentsSpy.mockImplementationOnce(async () => noteWithAComment);
          await callNoteFinder(request, next);
        });
  
        test('note is attached to request', () => {
          const { comments, ...noteWithoutComment } = request.note;
          expect(noteWithoutComment.dataValues).toStrictEqual(note.dataValues);
        });

        // tested with all comment attributes
        test('request note has a comment in the comments array', () => {
          const { comments } = request.note;
          expect(comments).toHaveLength(1);
          expect(comments[0].dataValues).toStrictEqual(comment.dataValues);
        });
  
        test('callback is called', () => {
          expect(next).toHaveBeenCalled();
        });
      });
    });

    describe('when a note is not found', () => {
      beforeEach(async () => {
        // mock note not found by returning undefined
        findNoteWithCommentsSpy.mockImplementationOnce(async () => undefined);
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
            message: expect.stringMatching(/Note does not exist/i)
          })
        );
      });
    });
  });

  test('next middleware is not called when noteService throws an Error', async () => {
    request = createRequest(id);

    findNoteWithCommentsSpy.mockImplementationOnce(() => {
      throw new ParseError('some error');
    });

    await expect(async () => await callNoteFinder(request, next))
      .rejects.toThrow(ParseError);

    expect(findNoteWithCommentsSpy).toHaveBeenCalledWith(id);

    expect(next).not.toHaveBeenCalled();
  });
});
