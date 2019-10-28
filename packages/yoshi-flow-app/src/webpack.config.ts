// eslint-disable-next-line import/no-unresolved
import webpack from 'webpack';
import {
  validateServerEntry,
  createServerEntries,
} from 'yoshi-common/build/webpack-utils';
import createBaseWebpackConfig from 'yoshi-common/build/webpack.config';
import { defaultEntry } from 'yoshi-helpers/constants';
import { Config } from 'yoshi-config/build/config';
import {
  isTypescriptProject,
  isSingleEntry,
  inTeamCity,
  isProduction,
} from 'yoshi-helpers/queries';

const useTypeScript = isTypescriptProject();

export async function createClientWebpackConfig(
  config: Config,
  { isDev, isHot }: { isDev?: boolean; isHot?: boolean } = {},
): Promise<webpack.Configuration> {
  const entry = config.entry || defaultEntry;

  const separateCss =
    config.separateCss === 'prod'
      ? inTeamCity() || isProduction()
      : config.separateCss;

  const clientConfig = await createBaseWebpackConfig({
    name: 'client',
    target: 'web',
    publicPath: '',
    isDev,
    isHot,
    useTypeScript,
    useAngular: config.isAngularProject,
    separateCss,
  });

  clientConfig.entry = isSingleEntry(entry) ? { app: entry as string } : entry;

  clientConfig.resolve!.alias = config.resolveAlias;

  clientConfig.externals = config.externals;

  return clientConfig;
}

export async function createServerWebpackConfig(
  config: Config,
  { isDev, isHot }: { isDev?: boolean; isHot?: boolean } = {},
): Promise<webpack.Configuration> {
  const serverConfig = await createBaseWebpackConfig({
    name: 'client',
    target: 'node',
    publicPath: '',
    isDev,
    isHot,
    useTypeScript,
    useAngular: config.isAngularProject,
  });

  serverConfig.entry = async () => {
    const serverEntry = validateServerEntry({
      extensions: ['.js', '.ts'],
      yoshiServer: config.yoshiServer,
    });

    let entryConfig = config.yoshiServer
      ? createServerEntries(serverConfig.context as string)
      : {};

    if (serverEntry) {
      entryConfig = { ...entryConfig, server: serverEntry };
    }

    return entryConfig;
  };

  serverConfig.resolve!.alias = config.resolveAlias;

  serverConfig.externals = config.externals;

  return serverConfig;
}
