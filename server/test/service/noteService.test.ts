import * as parser from '../../src/util/parser';
import { Note } from '../../src/model';
import * as noteService from '../../src/service/noteService';
import { ParseError } from '../../src/util/error';
import { noteAttr, noteWithComments } from '../constants';

const parseTextSpy = jest.spyOn(parser, 'parseText');
const parseIdSpy = jest.spyOn(parser, 'parseId');

const noteCreateSpy = jest.spyOn(Note, 'create');
const noteFindByPkSpy = jest.spyOn(Note, 'findByPk');

const validNoteCreationValues = noteAttr;

describe('createNote', () => {
  test('when content parser throws, no notes are created', async () => {
    parseTextSpy.mockImplementationOnce(() => { throw new ParseError('some error'); });

    await expect(async () => await noteService.createNote(validNoteCreationValues))
      .rejects.toThrow(ParseError);

    expect(noteCreateSpy).not.toHaveBeenCalled();
  });

  test('when content parser does not throw, a note is created with content', async () => {
    parseTextSpy.mockImplementationOnce((content: string) => content);

    await noteService.createNote(validNoteCreationValues);

    expect(noteCreateSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        content: validNoteCreationValues.content,
      })
    );
  });
});

describe('findNoteWithComments', () => {
  const id = 1;

  test('when id is invalid, no notes are searched for', async () => {
    parseIdSpy.mockImplementationOnce(() => { throw new ParseError('some error'); });

    await expect(async () => await noteService.findNoteWithComments(id))
      .rejects.toThrow(ParseError);

    expect(noteFindByPkSpy).not.toHaveBeenCalled();
  });

  test('when id is valid, note is returned', async () => {
    parseIdSpy.mockImplementationOnce(() => id);
    noteFindByPkSpy.mockImplementationOnce(async () => noteWithComments);

    const foundNote = await noteService.findNoteWithComments(id);

    // was called with correct note id
    expect(noteFindByPkSpy).toHaveBeenCalledWith(
      id, expect.anything(),
    );

    // returns the found note
    expect(foundNote.dataValues).toStrictEqual(noteWithComments.dataValues);
  });
});
