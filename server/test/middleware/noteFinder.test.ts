import noteFinder from '../../src/middleware/noteFinder';
import * as noteService from '../../src/service/noteService';
import { NextFunction, Request, Response } from 'express';
import { NOTE_WITH_COMMENTS } from '../constants';

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
      beforeEach(async () => {
        findNoteWithCommentsSpy.mockResolvedValueOnce(NOTE_WITH_COMMENTS);
        await callNoteFinder(request, next);
      });
  
      test('note is attached to request', () => {
        expect(request.note).toStrictEqual(NOTE_WITH_COMMENTS);
      });

      test('callback is called', () => {
        expect(next).toHaveBeenCalled();
      });
    });

    describe('when a note is not found', () => {
      beforeEach(async () => {
        // mock note not found by returning null
        findNoteWithCommentsSpy.mockResolvedValueOnce(null);
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

  test('next middleware is not called when noteService throws an error', async () => {
    request = createRequest(idString);

    findNoteWithCommentsSpy.mockImplementationOnce(() => {
      throw new Error('some error');
    });

    await expect(async () => await callNoteFinder(request, next))
      .rejects.toThrow();

    expect(findNoteWithCommentsSpy).toHaveBeenCalledWith(idString);

    expect(next).not.toHaveBeenCalled();
  });
});
