import HttpClient from 'yoshi-server-client';
import { greet } from '../src/api/greeting.api';

const client: HttpClient = new HttpClient({
  baseUrl: 'http://localhost:3000',
});

test('should reject on a non yoshi-server failing response', async () => {
  const response = client.request({
    method: greet,
    args: ['Yaniv'],
  });

  await expect(response).rejects.toThrow(
    'Yoshi Server: we received a response which we do not recognize',
  );
});
