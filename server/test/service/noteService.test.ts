import * as parser from '../../src/util/parser';
import { Note } from '../../src/model';
import * as noteService from '../../src/service/noteService';
import { NOTE, NOTE_ATTR, NOTE_WITH_COMMENTS } from '../constants';

const parseTextSpy = jest.spyOn(parser, 'parseText');
const parseIdSpy = jest.spyOn(parser, 'parseId');

const noteCreateSpy = jest.spyOn(Note, 'create');
const noteFindByPkSpy = jest.spyOn(Note, 'findByPk');

const noteCreationValues = { content: NOTE_ATTR.content };

describe('createNote', () => {
  test('when content parser throws, no notes are created', async () => {
    parseTextSpy.mockImplementationOnce(() => { throw new Error('some error'); });

    await expect(async () => await noteService.createNote(noteCreationValues))
      .rejects.toThrow();

    expect(noteCreateSpy).not.toHaveBeenCalled();
  });

  describe('when content parser does not throw', () => {
    beforeEach(() => {
      parseTextSpy.mockReturnValueOnce(noteCreationValues.content);
    });

    test('a note is created with content', async () => {
      noteCreateSpy.mockResolvedValueOnce(NOTE);

      const createdNote = await noteService.createNote(noteCreationValues);

      expect(noteCreateSpy).toHaveBeenCalledWith(noteCreationValues);
      expect(createdNote).toStrictEqual(NOTE);
    });

    test('note validation failure throws an error', async () => {
      noteCreateSpy.mockRejectedValueOnce(new Error('Some validation failed'));

      await expect(async () => await noteService.createNote(noteCreationValues))
        .rejects.toThrow();
    });
  });
});

describe('findNoteWithComments', () => {
  const id = 1;

  test('when id is invalid, no notes are searched for', async () => {
    // throw parsing error on id
    parseIdSpy.mockImplementationOnce(() => { throw new Error('some error'); });

    await expect(async () => await noteService.findNoteWithComments(id))
      .rejects.toThrow();

    expect(noteFindByPkSpy).not.toHaveBeenCalled();
  });

  describe('when id is valid', () => {
    beforeEach(() => {
      parseIdSpy.mockReturnValueOnce(id);
    });

    test('when note exists, the note is returned', async () => {
      // mock finding a note
      noteFindByPkSpy.mockResolvedValueOnce(NOTE_WITH_COMMENTS);

      const foundNote = await noteService.findNoteWithComments(id);

      // was called with correct note id
      expect(noteFindByPkSpy).toHaveBeenCalledWith(
        id, expect.anything(),
      );

      expect(foundNote).toStrictEqual(NOTE_WITH_COMMENTS);
    });

    test('when note does not exists, null is returned', async () => {
      // mock not found
      noteFindByPkSpy.mockResolvedValueOnce(null);

      const foundNote = await noteService.findNoteWithComments(id);

      // was called with correct note id
      expect(noteFindByPkSpy).toHaveBeenCalledWith(
        id, expect.anything(),
      );

      // note is not found
      expect(foundNote).toBe(null);
    });
  });
});
