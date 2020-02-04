import { NextFunction, Request, Response } from 'express';

const helloMiddleware = (req: Request, res: Response, next: NextFunction) => {
  next(new Error('there was an error!'));
};
export default [helloMiddleware];
