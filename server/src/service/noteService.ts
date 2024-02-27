import * as parser from '../util/parser';
import { Comment, Note } from '../model';
import { NoteDto } from '../types';
import { CreationAttributes } from 'sequelize';

export const createNote = async (values: CreationAttributes<Note>): Promise<Note> => {
  const noteContent = parser.parseText(values.content);
  return await Note.create({ content: noteContent });
};

export const findNoteWithComments = async (id: number): Promise<NoteDto> => {
  const note = await Note.findByPk(id, {
    include: {
      model: Comment,
      attributes: { exclude: ['noteId'] },
    }
  });

  return note as NoteDto;
};
