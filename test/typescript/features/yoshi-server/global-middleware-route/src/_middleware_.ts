import { NextFunction, Request, Response } from 'express';

const helloMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // @ts-ignore
  req.hello = 'hello from yoshi server middleware';
  next();
};
export default [helloMiddleware];
