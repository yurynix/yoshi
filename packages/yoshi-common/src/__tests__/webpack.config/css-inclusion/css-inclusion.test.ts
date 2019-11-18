// const path = require('path');
import path from 'path';
import webpack from 'webpack';
import express from 'express';
import ejs from 'ejs';
import { WebpackDevServer } from '../../../webpack-dev-server';
// @ts-ignore
import { matchCSS } from '../../../../../../test/utils';
// const Scripts = require('../../../../../../test/scripts');

// const scripts = new Scripts({
//   testDirectory: path.join(__dirname),
//   silent: true,
// });

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

// it.each(['serve', 'start'])('css inclusion %s', async command => {
//   await scripts[command](async () => {
//     await page.goto('http://localhost:3000');

//     const className = await page.$eval('#css-inclusion', elm =>
//       elm.getAttribute('class'),
//     );

//     await matchCSS('app', page, [
//       new RegExp(`.${className}{background:#ccc;color:#000;*}`),
//     ]);
//   });
// });

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

it('css inclusion', async () => {
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
});
