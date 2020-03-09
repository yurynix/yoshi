import { route } from 'yoshi-server';

export default route(async function() {
  throw new Error('There was an error');
});
