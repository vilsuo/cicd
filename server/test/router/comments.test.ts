import supertest from 'supertest';
import app from '../../src/app';
import { Note, Comment } from '../../src/model';
import { Attributes } from 'sequelize';
import { ApiResponse, expectMessage } from '../types';
import { NOTE_ATTR } from '../constants';

type PostCommentBody = Omit<Attributes<Comment>, 'createdAt'> & { createdAt: string };

type PostCommentResponse = ApiResponse<PostCommentBody>;

const api = supertest(app);

const postComment = async (noteId: number, values: object, code: number): Promise<PostCommentResponse> => {
  return await api
    .post(`/api/notes/${noteId}/comments`)
    .send(values)
    .expect(code)
    .expect('Content-Type', /application\/json/);
};

beforeEach(async () => {
  await Comment.sync({ force: true });
  await Note.sync({ force: true });
});

describe('POST comments', () => {
  const { content } = NOTE_ATTR;

  test('can not post a comment to a Note that does not exist', async () => {
    const nonExistingNoteId = 1234;
    const response = await postComment(nonExistingNoteId, { content }, 404);

    expectMessage(response.body, /Note does not exist/i);
  });

  describe('posting a Comment to an existing Note', () => {
    let note: Note;

    beforeEach(async () => {
      note = await Note.create({ content: 'Test note content' });
    });

    describe('with valid content', () => {
      let responseBody: PostCommentResponse['body'];

      beforeEach(async () => {
        const response = await postComment(note.id, { content }, 201);
        responseBody = response.body;
      });

      test('response contains posted Comment', () => {
        expect(responseBody).toEqual(
          expect.objectContaining({
            noteId: note.id,
            content: content,
          })
        );
      });

      test('posted Comment can be found', async () => {
        if ('id' in responseBody) {
          const foundComment = await Comment.findByPk(responseBody.id);

          expect(foundComment.noteId).toBe(note.id);
          expect(foundComment.content).toBe(content);
        } else {
          throw new Error('Expected property id');
        }
      });
    });

    it('too short content is bad request', async () => {
      const invalidContent = 'a'; // too short in length
      const response = await postComment(note.id, { content: invalidContent }, 400);

      expectMessage(response.body, /Content length must be/i);
    });
  });
});
