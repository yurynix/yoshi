import path from 'path';
import arg from 'arg';
import fs from 'fs-extra';
import { TARGET_DIR, BUILD_DIR, PUBLIC_DIR } from 'yoshi-config/paths';
import { watchPublicFolder } from 'yoshi-common/build/copy-assets';
import WebpackDevServer from 'yoshi-common/build/webpack-dev-server';
import { cliCommand } from '../bin/yoshi-app';
import {
  createClientWebpackConfig,
  createServerWebpackConfig,
} from '../webpack.config';

const join = (...dirs: Array<string>) => path.join(process.cwd(), ...dirs);

const start: cliCommand = async function(argv, config) {
  const args = arg(
    {
      // Types
      '--server': String,
      '--help': Boolean,
      // Aliases
      '-h': '--help',
      '--entry-point': '--server',
    },
    { argv },
  );

  await Promise.all([
    fs.emptyDir(join(BUILD_DIR)),
    fs.emptyDir(join(TARGET_DIR)),
  ]);

  if (await fs.pathExists(join(PUBLIC_DIR))) {
    watchPublicFolder();
  }

  const clientConfig = await createClientWebpackConfig(config, {
    isDev: true,
    isHot: config.hmr as boolean,
  });

  const serverConfig = await createServerWebpackConfig(config, {
    isDev: true,
    isHot: true,
  });

  const devServer = new WebpackDevServer([clientConfig, serverConfig], {
    publicPath: '',
    host: 'localhost',
    https: false,
    port: 3200,
  });

  await devServer.listenPromise();
};

export default start;
