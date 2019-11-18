import { createBaseWebpackConfig } from '../../../webpack.config';

const webpackConfig = createBaseWebpackConfig({
  configName: 'client',
  target: 'web',
  isDev: true,
  separateCss: true,
  devServerUrl: '',
  name: 'test',
  cwd: __dirname,
});

webpackConfig.entry = 'client';

export default webpackConfig;
