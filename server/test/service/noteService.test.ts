import * as parser from '../../src/util/parser';
import { Note } from '../../src/model';
import * as noteService from '../../src/service/noteService';
import { ParseError } from '../../src/util/error';
import { NOTE, NOTE_ATTR, NOTE_WITH_COMMENTS } from '../constants';

const parseTextSpy = jest.spyOn(parser, 'parseText');
const parseIdSpy = jest.spyOn(parser, 'parseId');

const noteCreateSpy = jest.spyOn(Note, 'create');
const noteFindByPkSpy = jest.spyOn(Note, 'findByPk');

const validNoteCreationValues = { content: NOTE_ATTR.content };

describe('createNote', () => {
  test('when content parser throws, no notes are created', async () => {
    parseTextSpy.mockImplementationOnce(() => { throw new ParseError('some error'); });

    await expect(async () => await noteService.createNote(validNoteCreationValues))
      .rejects.toThrow(ParseError);

    expect(noteCreateSpy).not.toHaveBeenCalled();
  });

  test('when content parser does not throw, a note is created with content', async () => {
    parseTextSpy.mockImplementationOnce(() => validNoteCreationValues.content);

    noteCreateSpy.mockImplementationOnce(() => NOTE);

    const createdNote = await noteService.createNote(validNoteCreationValues);

    expect(noteCreateSpy).toHaveBeenCalledWith(validNoteCreationValues);
    expect(createdNote).toStrictEqual(NOTE);
  });
});

describe('findNoteWithComments', () => {
  const id = 1;

  test('when id is invalid, no notes are searched for', async () => {
    // throw parsing error on id
    parseIdSpy.mockImplementationOnce(() => { throw new ParseError('some error'); });

    await expect(async () => await noteService.findNoteWithComments(id))
      .rejects.toThrow(ParseError);

    expect(noteFindByPkSpy).not.toHaveBeenCalled();
  });

  test('when id is valid and note exists, the note is returned', async () => {
    parseIdSpy.mockImplementationOnce(() => id);
    noteFindByPkSpy.mockImplementationOnce(() => Promise.resolve(NOTE_WITH_COMMENTS));

    const foundNote = await noteService.findNoteWithComments(id);

    // was called with correct note id
    expect(noteFindByPkSpy).toHaveBeenCalledWith(
      id, expect.anything(),
    );

    // returns the found note
    expect(foundNote.dataValues).toStrictEqual(NOTE_WITH_COMMENTS.dataValues);
  });

  test('when id is valid and note does not exists, null is returned', async () => {
    parseIdSpy.mockImplementationOnce(() => id);
    noteFindByPkSpy.mockImplementationOnce(() => null);

    const foundNote = await noteService.findNoteWithComments(id);

    // was called with correct note id
    expect(noteFindByPkSpy).toHaveBeenCalledWith(
      id, expect.anything(),
    );

    // note is not found
    expect(foundNote).toBe(null);
  });
});
