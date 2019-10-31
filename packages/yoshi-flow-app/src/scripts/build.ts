import path from 'path';
import fs from 'fs-extra';
import arg from 'arg';
import {
  BUILD_DIR,
  TARGET_DIR,
  PUBLIC_DIR,
  ASSETS_DIR,
} from 'yoshi-config/paths';
import { runWebpack } from 'yoshi-common/build/webpack-utils';
import writeManifest from 'yoshi-common/build/write-manifest';
import { inTeamCity } from 'yoshi-helpers/queries';
import {
  createClientWebpackConfig,
  createServerWebpackConfig,
} from '../webpack.config';
import { cliCommand } from '../bin/yoshi-app';

const join = (...dirs: Array<string>) => path.join(process.cwd(), ...dirs);

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

  const stats = await runWebpack([
    clientDebugConfig,
    clientOptimizedConfig,
    serverConfig,
  ]);

  if (inTeamCity()) {
    const [, clientOptimizedStats] = stats.stats;
    await writeManifest(clientOptimizedConfig, clientOptimizedStats);
  }
};

export default build;
