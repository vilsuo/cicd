import { Comment, Note } from './model';

export type NoteDto = Required<Note> & {
  comments: Partial<Comment>[];
};

