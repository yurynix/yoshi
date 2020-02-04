import { fn } from 'yoshi-server';

export const greet = fn(function() {
  return {
    greeting: this.req.hello,
  };
});
