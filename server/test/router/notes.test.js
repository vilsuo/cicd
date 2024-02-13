const supertest = require('supertest');
const app = require('../../src/app');
const { Note } = require('../../src/model');

const api = supertest(app);

const getNotes = async () => {
  const response = await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/);

  return response.body;
};

const getNote = async (id, code) => {
  const response = await api
    .get(`/api/notes/${id}`)
    .expect(code)
    .expect('Content-Type', /application\/json/);

  return response.body;
};

const postNote = async (values, code) => {
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

  test('after a Note has been posted, the Note is included in the array', async () => {
    const createdNote = await postNote({ content }, 201);
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

  test('can get a posted Note', async () => {
    const createdNote = await postNote({ content }, 201);
    const note = await getNote(createdNote.id, 200);

    expect(note.content).toBe(createdNote.content);
  });

  test('getting a Note increments its view count', async () => {
    const createdNote = await postNote({ content }, 201);
    expect(createdNote.views).toBe(0);

    const firstTime = await getNote(createdNote.id, 200);
    expect(firstTime.views).toBe(1);

    const secondTime = await getNote(createdNote.id, 200);
    expect(secondTime.views).toBe(2);
  });
});

describe('POST notes', () => {
  test('can not create a Note without content', async () => {
    const responseBody = await postNote({ content: '' }, 400);

    expect(responseBody.message).toMatch(/Content length must be/i);
  });

  test('created Note is returned', async () => {
    const note = await postNote({ content }, 201);

    expect(note.content).toBe(content);
    expect(note.id).not.toBeFalsy();
  });

  test('created Note can be found', async () => {
    const note = await postNote({ content }, 201);

    const foundNote = await Note.findByPk(note.id);
    expect(foundNote.content).toBe(content);
  });
});
