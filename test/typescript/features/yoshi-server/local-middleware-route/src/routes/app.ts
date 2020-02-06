import { route, render } from 'yoshi-server';
import { NextFunction } from 'express';

export const middlewares = [
  (req: Request, res: Response, next: NextFunction) => {
    // @ts-ignore
    req.title = 'hello from my local middlware';
    next();
  },
];

export default route(async function() {
  const html = await render('app', {
    // @ts-ignore
    title: this.req.title,
  });

  return html;
});
