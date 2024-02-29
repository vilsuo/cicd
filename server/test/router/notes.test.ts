import supertest from 'supertest';
import app from '../../src/app';
import { Note, Comment } from '../../src/model';
import {
  ApiResponse, ResponseModel,
  expectMessage, modelToResponseObject
} from '../types';
import { NOTE_ATTR } from '../constants';

const api = supertest(app);

type GetNotesResponse = ApiResponse<Array<ResponseModel<Note>>>;

const getNotes = async (): Promise<GetNotesResponse> => {
  return await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/);
};

type NoteComment = Omit<ResponseModel<Comment>, 'noteId'>;

type GetNoteBody = ResponseModel<Note> & { comments: Array<NoteComment> };

type GetNoteResponse = ApiResponse<GetNoteBody>;

const getNote = async (id: number, code: number): Promise<GetNoteResponse> => {
  return await api
    .get(`/api/notes/${id}`)
    .expect(code)
    .expect('Content-Type', /application\/json/);
};

type PostNoteResponse = ApiResponse<ResponseModel<Note>>;

const postNote = async (values: string | object, code: number): Promise<PostNoteResponse> => {
  return await api
    .post('/api/notes')
    .send(values)
    .expect(code)
    .expect('Content-Type', /application\/json/);
};

beforeEach(async () => {
  await Comment.sync({ force: true });
  await Note.sync({ force: true });
});

const { content } = NOTE_ATTR;

describe('GET notes', () => {
  test('without any Notes, an empty array is returned', async () => {
    const response = await getNotes();
    expect(response.body).toHaveLength(0);
  });

  test('after a Note has been created, the Note is included in the array', async () => {
    const createdNote = await Note.create({ content });
    const response = await getNotes();

    expect(response.body).toHaveLength(1);
    expect(response.body[0]).toStrictEqual(
      modelToResponseObject(createdNote.dataValues)
    );
  });
});

describe('Get a note', () => {
  test('can not get a Note that does not exist', async () => {
    const response = await getNote(1, 404);
    expectMessage(response.body, /Note does not exist/i);
  });

  test('can get a created Note', async () => {
    const createdNote = await Note.create({ content });
    const response = await getNote(createdNote.id, 200);

    // increment views locally because getting a note increments its views
    createdNote.views = 1;

    expect(response.body).toStrictEqual({
      ...modelToResponseObject(createdNote.dataValues),
      comments: [] // no comments
    });
  });

  test('comments are included in the Note', async () => {
    const createdNote = await Note.create({ content });
    const comment = await Comment.create({
      content: 'Comment content',
      noteId: createdNote.id
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { noteId, ...commentDatavalues } = comment.dataValues;

    const response = await getNote(createdNote.id, 200);
    expect(response.body).toMatchObject({
      comments: [
        modelToResponseObject(commentDatavalues)
      ]
    });
  });

  test('getting a Note increments its view count', async () => {
    const createdNote = await Note.create({ content });
    expect(createdNote.views).toBe(0);

    const response1 = await getNote(createdNote.id, 200);
    expect(response1.body).toMatchObject({ views: 1 });

    const response2 = await getNote(createdNote.id, 200);
    expect(response2.body).toMatchObject({ views: 2 });
  });
});

describe('POST notes', () => {
  test('can not post a Note without content', async () => {
    const response = await postNote({ content: '' }, 400);
    expectMessage(response.body, /length must be/i);
  });

  test('can not post a Note with non-string content', async () => {
    const response = await postNote({ content: [1, 2] }, 400);
    expectMessage(response.body, /a string/i);
  });

  describe('after posting a Note', () => {
    let response: PostNoteResponse;

    beforeEach(async () => {
      response = await postNote({ content }, 201);
    });

    test('posted Note does not have any views', () => {
      expect(response.body).toMatchObject({ views: 0 });
    });

    test('posted Note does not have Comments attached', () => {
      expect(response.body).not.toHaveProperty('comments');
    });
  
    test('posted content is in the response', () => {
      expect(response.body).toMatchObject({ content });
    });
  
    test('posted Note can be found', async () => {
      if ('id' in response.body) {
        const foundNote = await Note.findByPk(response.body.id);
        expect(foundNote.content).toBe(content);
      } else {
        throw new Error('Note id is not returned');
      }
    });
  });
});
