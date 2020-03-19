import { PackageJson } from 'read-pkg';
import { Config, InitialConfig } from './types';

export default (initialConfig: InitialConfig, pkgJson: PackageJson): Config => {
  const { jest = {} } = pkgJson;

  const cdnPort = initialConfig.bundle?.port ?? 3300;
  const cdnHttps = initialConfig.bundle?.https ?? false;
  const cdnUrl = `${cdnHttps ? 'https:' : 'http:'}//localhost:${cdnPort}/`;

  // If there is a bundle property, default to umd with package.json name
  const umd = initialConfig.bundle
    ? initialConfig.bundle.umd || pkgJson.name
    : undefined;

  const config: Config = {
    pkgJson,
    port: cdnPort,
    https: cdnHttps,
    url: cdnUrl,
    umd,
    bundle: !!initialConfig.bundle,
    entry: initialConfig.bundle?.entry || 'index.ts',
    externals: initialConfig.bundle?.externals ?? [],
    jestConfig: jest,
    storybook: initialConfig.storybook ?? false,
  };

  return config;
};
