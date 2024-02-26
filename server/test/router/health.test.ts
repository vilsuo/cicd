import supertest from 'supertest';
import app from '../../src/app';

const api = supertest(app);

test('health route should return ok', async () => {
  const response = await api.get('/api/health');

  expect(response.headers['content-type']).toMatch(/application\/json/);
  expect(response.statusCode).toBe(200);
  expect(response.body.message).toEqual('ok');
});
