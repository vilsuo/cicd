import { Attributes } from 'sequelize';
import { Comment, Note } from '../src/model';
import { NoteDto } from '../src/types';

export const noteAttr: Attributes<Note> = {
  id: 1,
  content: 'Initial note',
  views: 5,
  createdAt: new Date('2024-02-11T23:14:44.770Z'),
};

export const note: Required<Note> = Note.build(noteAttr);

export const commentAttr: Attributes<Comment> = {
  id: 2,
  content: 'Comment to the note',
  createdAt: new Date('2024-02-20T15:32:55.770Z'),
  noteId: 1,
};

export const comment = Comment.build(commentAttr);

export const noteWithComments: NoteDto = {
  ...note,
  comments: [comment],
};
