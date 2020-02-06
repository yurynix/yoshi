import { route, render } from 'yoshi-server';

export const middlewares = [
  (req, res, next) => {
    req.title = 'hello from my local middlware';
    next();
  },
];

export default route(async function() {
  const html = await render('app', {
    title: this.req.title,
  });

  return html;
});
