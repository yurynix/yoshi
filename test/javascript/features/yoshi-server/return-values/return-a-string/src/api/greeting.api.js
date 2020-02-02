import { fn } from 'yoshi-server';

export const greet = fn(function(name) {
  return `hello ${name}`;
});
