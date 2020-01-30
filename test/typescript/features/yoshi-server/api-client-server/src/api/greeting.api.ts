import { fn } from 'yoshi-server';

export const greet = fn(function(name) {
  return {
    greeting: `hello ${name}`,
    name,
  };
});
