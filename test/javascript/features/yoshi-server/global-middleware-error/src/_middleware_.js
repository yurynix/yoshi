const helloMiddleware = (req, res, next) => {
  next(new Error('there was an error!'));
};
export default [helloMiddleware];
