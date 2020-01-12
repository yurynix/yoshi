/* eslint-disable no-throw-literal */
// Assign env vars before requiring anything so that it is available to all files
process.env.BABEL_ENV = 'test';
process.env.NODE_ENV = 'test';

// Force short class names specifically for Protractor
// This means Protractor can't be run in watch mode and only with the output of
// `yoshi build`
//
// https://github.com/wix/yoshi/pull/1115
process.env.SHORT_CSS_PATTERN = 'true';

import path from 'path';
import execa from 'execa';
import minimatch from 'minimatch';
import minimist from 'minimist';
import { createRunner } from 'haste-core';
import globs from 'yoshi-config/globs';
import chalk from 'chalk';
import globby from 'globby';
import projectConfig from 'yoshi-config';
import { getChangedFilesForRoots } from 'jest-changed-files';
import {
  watchMode,
  hasE2ETests,
  hasBundleInStaticsDir,
  inPRTeamCity,
} from 'yoshi-helpers/queries';
import LoggerPlugin from 'yoshi-flow-legacy/src/plugins/haste-plugin-yoshi-logger';
import { printAndExitOnErrors } from 'yoshi-flow-legacy/src/error-handler';
import getDependencyResolver from 'yoshi-flow-legacy/src/commands/utils/dependency-resolver';
import { cliCommand } from '../bin/yoshi-flow-editor';

const runner = createRunner({
  logger: new LoggerPlugin(),
});

const rawCliArgs = process.argv.slice(2);
const cliArgs = minimist(rawCliArgs);

const debugPort = cliArgs.debug;
const debugBrkPort = cliArgs['debug-brk'];
const shouldWatch = cliArgs.watch || cliArgs.w || watchMode();

type TestOptions = {
  port?: string | number;
  ssl?: boolean;
  hmr?: boolean;
  liveReload?: boolean;
  transformHMRRuntime?: boolean;
  host?: string;
  publicPath?: string;
  statics?: string;
  webpackConfigPath?: string;
  configuredEntry?: string;
  defaultEntry?: string;
};
type TestTask = (
  options: TestOptions,
  titleOption?: { title: string },
) => Promise<undefined>;

const test: cliCommand = runner.command(
  async (tasks: Record<string, TestTask>) => {
    const wixCdn =
      tasks[require.resolve('yoshi-flow-legacy/src/tasks/cdn/index')];

    function bootstrapCdn() {
      if (!hasBundleInStaticsDir()) {
        console.error();
        console.error(
          chalk.red(
            ' ● Warning:\n\n' +
              '   you are running e2e tests and does not have any bundle located in the statics directory\n' +
              '   you probably need to run ' +
              chalk.bold('npx yoshi build') +
              ' before running the tests',
          ),
        );
        console.error();
      }

      return printAndExitOnErrors(() =>
        wixCdn(
          {
            port: 3200,
            ssl: true,
            publicPath: 'https://localhost:3200/',
            statics: 'dist/statics/',
          },
          { title: 'cdn' },
        ),
      );
    }

    if (!shouldWatch && hasE2ETests()) {
      await bootstrapCdn();
    }

    const configPath = require.resolve(
      'yoshi-flow-legacy/config/jest.config.js',
    );

    const jestCliOptions = [
      require.resolve('jest/bin/jest'),
      `--config=${configPath}`,
      `--rootDir=${process.cwd()}`,
    ];

    shouldWatch && jestCliOptions.push('--watch');

    const jestForwardedOptions = rawCliArgs
      .slice(rawCliArgs.indexOf('test') + 1)
      // filter yoshi's option
      .filter(arg => arg !== '--jest' && arg.indexOf('debug') === -1);

    jestCliOptions.push(...jestForwardedOptions);

    if (debugBrkPort !== undefined) {
      jestCliOptions.unshift(`--inspect-brk=${debugBrkPort}`);
      !jestForwardedOptions.includes('--runInBand') &&
        jestCliOptions.push('--runInBand');
    } else if (debugPort !== undefined) {
      jestCliOptions.unshift(`--inspect=${debugPort}`);
      !jestForwardedOptions.includes('--runInBand') &&
        jestCliOptions.push('--runInBand');
    }

    const rootDir = process.cwd();

    // Run minimal tests on PR CI
    if (
      inPRTeamCity() &&
      projectConfig.experimentalMinimalPRBuild &&
      // Run only if this project is using `jest-yoshi-preset`
      (projectConfig.jestConfig as { preset?: string }).preset ===
        'jest-yoshi-preset'
    ) {
      const { changedFiles } = await getChangedFilesForRoots([rootDir], {
        changedSince: 'master',
      });

      const rootChanges = Array.from(changedFiles).filter(
        filename => path.dirname(filename) === rootDir,
      );

      // Only optimize this run if none of the root files have changed
      //
      // Root files can be `package.json`, `.nvmrc` and others which
      // require us to run the entire suite
      if (rootChanges.length === 0) {
        const resolver = await getDependencyResolver();

        // Filter files to only include unit test files
        const unitTests = resolver.resolveInverse(
          changedFiles,
          (filename: string) =>
            globs.unitTests.some(pattern =>
              minimatch(path.relative(rootDir, filename), pattern),
            ),
        );

        // Find all e2e tests
        const e2eTests = await globby(globs.e2eTests, { gitignore: true });

        jestCliOptions.push(
          '--runTestsByPath',
          // Push minimal unit tests
          ...unitTests,
          // Push all e2e tests
          ...e2eTests,
        );
      }
    }

    try {
      await execa('node', jestCliOptions, { stdio: 'inherit' });
    } catch (error) {
      console.error(`jest failed with status code "${error.code}"`);
      process.exit(1);
    }
  },
  { persistent: shouldWatch },
);

export default test;
