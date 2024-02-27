import { Comment, Note } from '../model';
import { NoteDto } from '../types';

export const findNoteWithComments = async (id: number): Promise<NoteDto> => {
  const note = await Note.findByPk(id, {
    include: {
      model: Comment,
      attributes: { exclude: ['noteId'] },
    }
  });

  return note as NoteDto;
};
