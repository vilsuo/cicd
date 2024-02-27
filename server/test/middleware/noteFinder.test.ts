import noteFinder from '../../src/middleware/noteFinder';
import * as parser from '../../src/util/parser';
import * as noteService from '../../src/service/noteService';
import { Note, Comment } from '../../src/model';
import { ParseError } from '../../src/util/error';
import { NextFunction, Request, Response } from 'express';
import { Attributes } from 'sequelize';
import { NoteDto } from '../../src/types';

const parseIdSpy = jest.spyOn(parser, 'parseId');

const findNoteWithCommentsSpy = jest.spyOn(noteService, 'findNoteWithComments');

const next: NextFunction = jest.fn();

const noteAttr: Attributes<Note> = {
  id: 1,
  content: 'Initial note',
  views: 5,
  createdAt: new Date('2024-02-11T23:14:44.770Z'),
};

const note: Required<Note> = Note.build(noteAttr);

const commentAttr: Attributes<Comment> = {
  id: 2,
  content: 'Comment to the note',
  createdAt: new Date('2024-02-20T15:32:55.770Z'),
  noteId: 1,
};

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
  let request: Partial<Request>;

  describe('valid id', () => {
    const idString = '1';
    const idNumber = 1;

    beforeEach(async () => {
      request = createRequest(idString);
      parseIdSpy.mockImplementationOnce(() => idNumber);
    });

    afterEach(() => {
      expect(parseIdSpy).toHaveBeenCalledWith(idString);
      expect(findNoteWithCommentsSpy).toHaveBeenCalledWith(idNumber);
    });

    describe('existing Note', () => {
      describe('without any Comments', () => {
        const noteWithComments: NoteDto = {
          ...note,
          comments: [],
        };

        beforeEach(async () => {
          findNoteWithCommentsSpy.mockImplementationOnce(async () => noteWithComments);
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
        const noteWithComments: NoteDto = {
          ...note,
          comments: [comment],
        };

        beforeEach(async () => {
          findNoteWithCommentsSpy.mockImplementationOnce(async () => noteWithComments);
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

    describe('non-existing Note', () => {
      beforeEach(async () => {
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

  test('invalid id throws an Error', async () => {
    const idInvalid = 'abc';
    const request = createRequest(idInvalid);

    // mock parser to throw an Error
    parseIdSpy.mockImplementationOnce(() => { throw new ParseError('some error'); });

    await expect(async () => await callNoteFinder(request, next))
      .rejects.toThrow(ParseError);

    expect(parseIdSpy).toHaveBeenCalledWith(idInvalid);

    expect(findNoteWithCommentsSpy).not.toHaveBeenCalled();
    
    expect(next).not.toHaveBeenCalled();
  });
});
