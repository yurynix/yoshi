import webpack from 'webpack';
import { runWebpack } from './webpack-utils';
import { isTruthy } from './utils/helpers';

export type NamedConfiguration = {
  name: string;
  configs: Array<webpack.Configuration>;
};

export default class WebpackManager {
  private namedConfigs: Array<NamedConfiguration>;

  constructor() {
    this.namedConfigs = [];
  }

  addConfigs(name: string, configs: Array<webpack.Configuration | undefined>) {
    this.namedConfigs.push({ name, configs: configs.filter(isTruthy) });
  }

  async run() {
    const webpackConfigs = this.namedConfigs.reduce(
      (acc: Array<webpack.Configuration>, { configs }) => {
        return [...acc, ...configs];
      },
      [],
    );

    const webpackStats = await runWebpack(webpackConfigs);

    return {
      getAppData: (
        configName: string,
      ): {
        configs: Array<webpack.Configuration>;
        stats: Array<webpack.Stats>;
      } => {
        let appConfigStartIndex = 0;
        let appConfigEndIndex = 0;

        // Webpack's configs and stats are being spread in a flat list
        // This function iterate over each app and locate the configs and stats
        // that assosiate with the requested app
        for (const entry of this.namedConfigs) {
          const { name, configs } = entry;

          if (configName === name) {
            appConfigEndIndex = appConfigStartIndex + configs.length;
            break;
          }

          appConfigStartIndex += configs.length;
        }

        const stats = webpackStats.stats.slice(
          appConfigStartIndex,
          appConfigEndIndex,
        );

        const configs = webpackConfigs.slice(
          appConfigStartIndex,
          appConfigEndIndex,
        );

        return { configs, stats };
      },
    };
  }
}
