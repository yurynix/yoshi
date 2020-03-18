// eslint-disable-next-line import/no-extraneous-dependencies
import { Entry, EntryFunc, ExternalsElement } from 'webpack';
import { PackageJson } from 'read-pkg';

type WebpackEntry = string | Array<string> | Entry | EntryFunc;

type WebpackExternals = ExternalsElement | Array<ExternalsElement>;

export type InitialConfig = {
  bundle: {
    umd?: string;
    cssModules?: boolean;
    separateCss?: boolean | 'prod';
    entry?: WebpackEntry;
    externals?: WebpackExternals;
    port?: number;
    https?: boolean;
  };
  storybook?: boolean;
};

export type Config = {
  pkgJson: PackageJson;
  jestConfig: unknown;
  cssModules?: boolean;
  separateCss?: boolean | 'prod';
  bundle: boolean;
  entry: WebpackEntry;
  umd?: string;
  port: number;
  https: boolean;
  url: string;
  externals: WebpackExternals;
  storybook: boolean;
};

export type RequiredRecursively<T> = Exclude<
  T extends string | number | boolean | Function | RegExp
    ? T
    : {
        [P in keyof T]-?: T[P] extends Array<infer U>
          ? Array<RequiredRecursively<U>>
          : T[P] extends Array<infer U>
          ? Array<RequiredRecursively<U>>
          : RequiredRecursively<T[P]>;
      },
  null | undefined
>;
