import * as parser from '../util/parser';
import { Comment, Note } from '../model';
import { NoteDto } from '../types';
import { CreationAttributes } from 'sequelize';

export const createNote = async (values: CreationAttributes<Note>): Promise<Note> => {
  const noteContent = parser.parseText(values.content);
  return await Note.create({ content: noteContent });
};

/*
const isObject = (value: unknown): value is object => {
  return typeof value === 'object' && value !== null;
};

export const createNote = async (values: unknown): Promise<Note> => {
  if (isObject(values) && 'content' in values) {
    const noteContent = parser.parseText(values.content);
    return await Note.create({ content: noteContent });
  }
};
*/

export const findNoteWithComments = async (id: unknown): Promise<NoteDto | null> => {
  const noteId = parser.parseId(id);
  const note = await Note.findByPk(noteId, {
    include: {
      model: Comment,
      attributes: { exclude: ['noteId'] },
    }
  });

  return note as NoteDto | null;
};
