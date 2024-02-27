import supertest from 'supertest';
import app from '../../src/app';
import { Note, Comment } from '../../src/model';

const api = supertest(app);

const getNotes = async () => {
  const response = await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/);

  return response.body;
};

const getNote = async (id: number, code: number) => {
  const response = await api
    .get(`/api/notes/${id}`)
    .expect(code)
    .expect('Content-Type', /application\/json/);

  return response.body;
};

const postNote = async (values: string | object, code: number) => {
  const response = await api
    .post('/api/notes')
    .send(values)
    .expect(code)
    .expect('Content-Type', /application\/json/);

  return response.body;
};

beforeEach(async () => {
  await Note.sync({ force: true });
});

const content = 'Test content';

describe('GET notes', () => {
  test('without any Notes, an empty array is returned', async () => {
    const notes = await getNotes();
    expect(notes.length).toBe(0);
  });

  test('after a Note has been created, the Note is included in the array', async () => {
    const createdNote = await Note.create({ content });
    const notes = await getNotes();

    expect(notes.length).toBe(1);
    expect(notes[0].content).toBe(createdNote.content);
  });
});

describe('Get note', () => {
  test('can not get a Note that does not exist', async () => {
    const responseBody = await getNote(1, 404);
    expect(responseBody.message).toMatch(/Note does not exist/i);
  });

  test('can get a created Note', async () => {
    const createdNote = await Note.create({ content });
    const note = await getNote(createdNote.id, 200);

    expect(note.content).toBe(createdNote.content);
  });

  test('comments are included in the Note', async () => {
    const createdNote = await Note.create({ content });
    const comment = await Comment.create({
      content: 'Comment content',
      noteId: createdNote.id
    });

    const note = await getNote(createdNote.id, 200);
    expect(note.comments[0].content).toBe(comment.content);
  });

  test('getting a Note increments its view count', async () => {
    const createdNote = await Note.create({ content });
    expect(createdNote.views).toBe(0);

    const firstTime = await getNote(createdNote.id, 200);
    expect(firstTime.views).toBe(1);

    const secondTime = await getNote(createdNote.id, 200);
    expect(secondTime.views).toBe(2);
  });
});

describe('POST notes', () => {
  test('can not post a Note without content', async () => {
    const responseBody = await postNote({ content: '' }, 400);

    expect(responseBody.message).toMatch(/Content length must be/i);
  });

  test('can not post a Note with non-string content', async () => {
    const responseBody = await postNote({ content: [1, 2] }, 400);

    expect(responseBody.message).toMatch(/string/i);
  });

  describe('after posting a Note', () => {
    let note;

    beforeEach(async () => {
      note = await postNote({ content }, 201);
    });

    test('posted Note does not have any views', async () => {
      expect(note.views).toBe(0);
    });

    test('posted Note does not have Comments attached', async () => {
      expect(note).not.toHaveProperty('comments');
    });
  
    test('posted Note is returned', async () => {
      expect(note.content).toBe(content);
      expect(note.id).not.toBeFalsy();
    });
  
    test('posted Note can be found', async () => {
      const foundNote = await Note.findByPk(note.id);
      expect(foundNote.content).toBe(content);
    });
  });
});
