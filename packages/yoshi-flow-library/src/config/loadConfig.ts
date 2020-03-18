import readPkg from 'read-pkg';
import cosmiconfig from 'cosmiconfig';
import { validate as validateConfig } from 'jest-validate';
import boxen from 'boxen';
import chalk from 'chalk';
import { Config, InitialConfig } from './types';
import validConfig from './validConfig';
import normalize from './normalize';

const explorer = cosmiconfig('yoshiFlowLibrary', {
  searchPlaces: ['package.json'],
});

export default ({ validate = true, cwd = process.cwd() } = {}): Config => {
  const result = explorer.searchSync(cwd);

  if (!result) {
    const oldYoshiConfig = cosmiconfig('yoshi', {
      searchPlaces: ['package.json', 'yoshi.config.js'],
    }).searchSync(cwd);

    if (oldYoshiConfig) {
      // TODO improve message and send to a documentation link
      console.warn(
        boxen(
          chalk.yellow(
            `You are using an old yoshi config
switch to yoshiFlowLibrary property on package.json`,
          ),
          { padding: 1 },
        ),
      );
    }
  }

  const initialConfig = (result ? result.config : {}) as InitialConfig;

  // Validate correctness
  if (validate) {
    validateConfig(initialConfig, {
      exampleConfig: validConfig,
    });
  }

  // Load package.json
  const pkgJson = readPkg.sync({ cwd });

  // Normalize values
  const config = normalize(initialConfig, pkgJson);

  return config;
};
