import path from 'path';
import webpack from 'webpack';
import express from 'express';
import ejs from 'ejs';
import { WebpackDevServer } from '../../../webpack-dev-server';
import { matchCSS } from '../../../../../../test/utils';
import { createBaseWebpackConfig } from '../../../webpack.config';

it.each([{ isDev: true }, { isDev: false }])(
  'css inclusion',
  async ({ isDev }) => {
    const webpackConfig = createBaseWebpackConfig({
      configName: 'client',
      target: 'web',
      isDev,
      separateCss: true,
      devServerUrl: '',
      name: 'test',
      cwd: __dirname,
    });

    webpackConfig.entry = 'client';

    webpackConfig.externals = {
      react: 'React',
      'react-dom': 'ReactDOM',
    };

    const compiler = webpack(webpackConfig);

    const webpackDevServer = new WebpackDevServer(compiler, {
      cwd: __dirname,
      https: false,
      port: 3200,
      publicPath: '',
    });

    const app = express();

    app.get('/', async (req, res) => {
      res.send(await ejs.renderFile(path.join(__dirname, './src/index.ejs')));
    });

    await webpackDevServer.listenPromise();
    const server = app.listen(3000);

    try {
      await page.goto('http://localhost:3000');

      const className = await page.$eval('#css-inclusion', elm =>
        elm.getAttribute('class'),
      );

      await matchCSS('main', page, [
        new RegExp(`.${className}{background:#ccc;color:#000;*}`),
      ]);
    } finally {
      server.close();
      webpackDevServer.close();
    }
  },
);
