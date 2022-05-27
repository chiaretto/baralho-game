import request from 'supertest';

import { app } from '../../app';

describe('Test Home', () => {
  it('Request / should return string', async () => {
    const result = await request(app).get('/').send();

    expect(result.status).toBe(200);
    expect(result.body.data).toEqual('Express + TypeScript Server');
  });
});
