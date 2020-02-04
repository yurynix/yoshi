const helloMiddleware = (req, res, next) => {
  req.hello = 'hello from yoshi server middleware';
  next();
};
export default [helloMiddleware];
