import request from 'supertest';

import { app } from '../../app';

describe('Test NotFound', () => {
  it('Request /xablau should return notfound', async () => {
    const result = await request(app).get('/xablau').send();

    expect(result.status).toBe(404);
    expect(result.body.error).toEqual('Page not found!');
  });
});
