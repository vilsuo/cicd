import supertest from 'supertest';
import app from '../../src/app';
import { ApiResponse, expectMessage } from '../types';

type GetHealthBody = { message: string };

type GetHealthResponse = ApiResponse<GetHealthBody>;

const api = supertest(app);

const healthCheck = async (code: number): Promise<GetHealthResponse> => {
  return await api
    .get('/api/health')
    .expect(code)
    .expect('Content-Type', /application\/json/);
};

test('health route should return ok', async () => {
  const response = await healthCheck(200);
  expectMessage(response.body, 'ok');
});
