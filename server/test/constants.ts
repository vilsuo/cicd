import { Attributes } from 'sequelize';
import { Comment, Note } from '../src/model';
import { NoteDto } from '../src/types';

export const NOTE_ATTR: Attributes<Note> = {
  id: 1,
  content: 'Initial note',
  views: 5,
  createdAt: new Date('2024-02-11T23:14:44.770Z'),
};

export const NOTE: Required<Note> = Note.build(NOTE_ATTR);

export const COMMENT_ATTR: Attributes<Comment> = {
  id: 2,
  content: 'Comment to the note',
  createdAt: new Date('2024-02-20T15:32:55.770Z'),
  noteId: 1,
};

export const COMMENT = Comment.build(COMMENT_ATTR);

export const NOTE_WITH_COMMENTS: NoteDto = {
  ...NOTE,
  comments: [COMMENT],
};
