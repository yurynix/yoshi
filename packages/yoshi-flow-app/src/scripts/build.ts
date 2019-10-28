import path from 'path';
import fs from 'fs-extra';
import arg from 'arg';
import {
  BUILD_DIR,
  TARGET_DIR,
  PUBLIC_DIR,
  ASSETS_DIR,
} from 'yoshi-config/paths';
import { createCompiler } from 'yoshi-common/build/webpack-utils';
import {
  createClientWebpackConfig,
  createServerWebpackConfig,
} from '../webpack.config';
import { cliCommand } from '../bin/yoshi-app';

const build: cliCommand = async function(argv, config) {
  const args = arg(
    {
      // Types
      '--help': Boolean,
      // Aliases
      '-h': '--help',
    },
    { argv },
  );

  const join = (...dirs: Array<string>) => path.join(process.cwd(), ...dirs);

  await Promise.all([
    fs.emptyDir(join(BUILD_DIR)),
    fs.emptyDir(join(TARGET_DIR)),
  ]);

  if (await fs.pathExists(join(PUBLIC_DIR))) {
    await fs.copy(join(PUBLIC_DIR), join(ASSETS_DIR));
  }

  const clientDebugConfig = await createClientWebpackConfig(config, {
    isDev: true,
  });

  const clientOptimizedConfig = await createClientWebpackConfig(config);

  const serverConfig = await createServerWebpackConfig(config, {
    isDev: true,
  });

  const compiler = createCompiler(
    [clientDebugConfig, clientOptimizedConfig, serverConfig],
    {
      https: false,
      port: 3200,
    },
  );
};

export default build;
