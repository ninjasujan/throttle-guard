import axios from 'axios';

describe('GET /api', () => {
  it('should return status 200', async () => {
    const res = await axios.get('/api/app');
    expect(res.status).toBe(200);
  });
});
