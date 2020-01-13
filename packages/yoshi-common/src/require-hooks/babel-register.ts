import createBabelConfig from '../create-babel-config';
import shouldTranspileFile from '../utils/should-transpile-file';

const babelConfig = createBabelConfig();

require('@babel/register')({
  only: [shouldTranspileFile],
  ...babelConfig,
});
