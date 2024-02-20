const supertest = require('supertest');
const app = require('../../src/app');
const { Note, Comment } = require('../../src/model');

const api = supertest(app);

const postComment = async (noteId, values, code) => {
  const response = await api
    .post(`/api/notes/${noteId}/comments`)
    .send(values)
    .expect(code)
    .expect('Content-Type', /application\/json/);

  return response.body;
};

beforeEach(async () => {
  await Comment.sync({ force: true });
  await Note.sync({ force: true });
});

describe('POST comments', () => {
  const content = 'Test comment';

  test('can not post a comment to a Note that does not exist', async () => {
    const noteId = 1234;

    const responseBody = await postComment(noteId, { content }, 404);
    expect(responseBody.message).toMatch(/Note does not exist/i);
  });

  describe('posting comment to an existing Note', () => {
    let note;

    beforeEach(async () => {
      note = await Note.create({ content: 'Test note content' });
    });

    test('can post a Comment to Note', async () => {
      await postComment(note.id, { content }, 201);
    });

    test('response contains posted Comment', async () => {
      const comment = await postComment(note.id, { content }, 201);

      expect(comment.noteId).toBe(note.id);
      expect(comment.content).toBe(content);
    });

    test('posted Comment can be found', async () => {
      const comment = await postComment(note.id, { content }, 201);

      const foundComment = await Comment.findByPk(comment.id);

      expect(foundComment.noteId).toBe(note.id);
      expect(foundComment.content).toBe(content);
    });
  });
});
