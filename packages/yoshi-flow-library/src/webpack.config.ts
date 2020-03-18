// eslint-disable-next-line import/no-extraneous-dependencies
import webpack from 'webpack';
import { createBaseWebpackConfig } from 'yoshi-common/build/webpack.config';
import {
  isSingleEntry,
  inTeamCity,
  isProduction,
} from 'yoshi-helpers/build/queries';
import { Config } from './config/types';

export function createClientWebpackConfig(
  config: Config,
  {
    isDev,
    isHot,
    isAnalyze,
    forceEmitSourceMaps,
  }: {
    isDev?: boolean;
    isHot?: boolean;
    suricate?: boolean;
    isAnalyze?: boolean;
    forceEmitSourceMaps?: boolean;
  } = {},
): webpack.Configuration {
  const entry = config.entry;

  const separateCss =
    config.separateCss === 'prod'
      ? inTeamCity() || isProduction()
      : config.separateCss;

  const clientConfig = createBaseWebpackConfig({
    name: config.pkgJson.name as string,
    useTypeScript: true,
    typeCheckTypeScript: false,
    devServerUrl: config.url,
    configName: 'client',
    target: 'web',
    isDev,
    isHot,
    isAnalyze,
    forceEmitSourceMaps,
    exportAsLibraryName: config.umd,
    cssModules: config.cssModules,
    separateCss,
  });

  clientConfig.entry = isSingleEntry(entry) ? { app: entry as string } : entry;

  clientConfig.externals = config.externals;

  return clientConfig;
}
