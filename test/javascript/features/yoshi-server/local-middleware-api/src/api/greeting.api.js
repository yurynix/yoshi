import { fn } from 'yoshi-server';

export const middlewares = [
  (req, res, next) => {
    req.title = 'hello from my local middlware';
    next();
  },
];

export const greet = fn(function() {
  return {
    greeting: this.req.title,
  };
});
