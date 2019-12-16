import path from 'path';
// eslint-disable-next-line import/no-extraneous-dependencies
import webpack from 'webpack';
import {
  validateServerEntry,
  createServerEntries,
} from 'yoshi-common/webpack-utils';
import { createBaseWebpackConfig } from 'yoshi-common/webpack.config';
import { defaultEntry } from 'yoshi-helpers/constants';
import { Config } from 'yoshi-config/build/config';
import {
  isTypescriptProject,
  isSingleEntry,
  inTeamCity,
  isProduction,
} from 'yoshi-helpers/queries';
import { STATICS_DIR } from 'yoshi-config/paths';
import ManifestPlugin from 'yoshi-common/build/manifest-webpack-plugin';
import { PackageGraphNode } from './load-package-graph';

const useTypeScript = isTypescriptProject();

const createDefaultOptions = (rootConfig: Config, pkg: PackageGraphNode) => {
  const separateCss =
    pkg.config.separateCss === 'prod'
      ? inTeamCity() || isProduction()
      : pkg.config.separateCss;

  return {
    name: pkg.config.name as string,
    useTypeScript,
    typeCheckTypeScript: false, // useTypeScript,
    useAngular: pkg.config.isAngularProject,
    devServerUrl: pkg.config.servers.cdn.url,
    cssModules: pkg.config.cssModules,
    separateCss,
  };
};

export function createClientWebpackConfig(
  rootConfig: Config,
  pkg: PackageGraphNode,
  {
    isDev,
    isHot,
    isAnalyze,
    forceEmitSourceMaps,
  }: {
    isDev?: boolean;
    isHot?: boolean;
    isAnalyze?: boolean;
    forceEmitSourceMaps?: boolean;
  } = {},
): webpack.Configuration {
  const entry = pkg.config.entry || defaultEntry;

  const defaultOptions = createDefaultOptions(rootConfig, pkg);

  const customSiteAssetsModule = pkg.name === 'thunderbolt-becky';

  const clientConfig = createBaseWebpackConfig({
    cwd: pkg.location,
    configName: 'client',
    target: 'web',
    isDev,
    isHot,
    isAnalyze,
    forceEmitSourceMaps,
    exportAsLibraryName: pkg.config.exports,
    enhancedTpaStyle: pkg.config.enhancedTpaStyle,
    tpaStyle: pkg.config.tpaStyle,
    contentHash: pkg.config.experimentalBuildHtml,
    createEjsTemplates: pkg.config.experimentalBuildHtml,
    ...(customSiteAssetsModule
      ? {
          configName: 'site-assets',
          target: 'node',
          useNodeExternals: false,
        }
      : {}),
    ...defaultOptions,
  });

  if (customSiteAssetsModule) {
    // Apply manifest since standard `node` webpack configs don't
    clientConfig.plugins!.push(
      new ManifestPlugin({ fileName: 'manifest', isDev: isDev as boolean }),
    );
    clientConfig.output!.path = path.join(pkg.location, STATICS_DIR);
    clientConfig.output!.filename = '[name].bundle.js';
    clientConfig.output!.chunkFilename = '[name].chunk.js';
  }

  clientConfig.entry = isSingleEntry(entry) ? { app: entry as string } : entry;
  clientConfig.resolve!.alias = pkg.config.resolveAlias;
  clientConfig.externals = pkg.config.externals;

  return clientConfig;
}

export function createServerWebpackConfig(
  rootConfig: Config,
  libs: Array<PackageGraphNode>,
  pkg: PackageGraphNode,
  { isDev, isHot }: { isDev?: boolean; isHot?: boolean } = {},
): webpack.Configuration {
  const defaultOptions = createDefaultOptions(rootConfig, pkg);

  const customThunderboltElements = pkg.name === 'thunderbolt-elements';

  const serverConfig = createBaseWebpackConfig({
    cwd: pkg.location,
    configName: 'server',
    target: 'node',
    isDev,
    isHot,
    useNodeExternals: !customThunderboltElements,
    nodeExternalsWhitelist: libs.map(pkg => new RegExp(pkg.name)),
    useAssetRelocator: pkg.config.experimentalUseAssetRelocator,
    ...defaultOptions,
  });

  if (customThunderboltElements) {
    serverConfig.output!.path = path.join(pkg.location, STATICS_DIR);
    serverConfig.plugins!.push(
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1,
      }),
    );
  }

  serverConfig.entry = async () => {
    const serverEntry = validateServerEntry({
      cwd: pkg.location,
      extensions: serverConfig.resolve!.extensions as Array<string>,
      yoshiServer: pkg.config.yoshiServer,
    });

    let entryConfig = pkg.config.yoshiServer
      ? createServerEntries(serverConfig.context as string, pkg.location)
      : {};

    if (serverEntry) {
      entryConfig = { ...entryConfig, server: serverEntry };
    }

    return entryConfig;
  };

  return serverConfig;
}

export function createWebWorkerWebpackConfig(
  rootConfig: Config,
  pkg: PackageGraphNode,
  { isDev, isHot }: { isDev?: boolean; isHot?: boolean } = {},
): webpack.Configuration {
  const defaultOptions = createDefaultOptions(rootConfig, pkg);

  const workerConfig = createBaseWebpackConfig({
    cwd: pkg.location,
    configName: 'web-worker',
    target: 'webworker',
    isDev,
    isHot,
    ...defaultOptions,
  });

  workerConfig.output!.library = '[name]';
  workerConfig.output!.libraryTarget = 'umd';
  workerConfig.output!.globalObject = 'self';

  workerConfig.entry = pkg.config.webWorkerEntry;

  workerConfig.externals = pkg.config.webWorkerExternals;

  return workerConfig;
}
