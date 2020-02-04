import { fn } from 'yoshi-server';

export const greet = fn(function() {
  return {
    // @ts-ignore
    greeting: this.req.hello,
  };
});
