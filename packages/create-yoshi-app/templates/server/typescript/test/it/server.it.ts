import { expect } from 'chai';
import { env } from '../environment';

describe('API', () => {
  const { axios } = env.beforeAndAfter();

  it('should return a valid response', async () => {
    const response = await axios.get('/');

    expect(response.data).to.deep.include({
      success: true,
      payload: 'Hello world!',
      petriScopes: ['foo', 'bar'],
      baseDomain: 'test.wix.com',
    });
  });
});
