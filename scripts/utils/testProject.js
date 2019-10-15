const path = require('path');
const fs = require('fs-extra');
const execa = require('execa');
const chalk = require('chalk');
const Scripts = require('../../test/scripts');
const { ciEnv, localEnv } = require('./constants');

const testProductionBuildScript = `npx jest --config='jest.production.config.js' --no-cache --runInBand`;
const testLocalDevelopmentScript = `npx jest --config='jest.development.config.js' --no-cache --runInBand`;
const runAdditionalTestsScript = `npx jest --config='jest.plain.config.js' --no-cache --runInBand`;

module.exports = async ({
  templateDirectory,
  testDirectory,
  rootDirectory,
  watchMode = false,
  buildMode,
}) => {
  console.log();
  console.log(
    chalk.blue.bold(
      `> Testing ${chalk.underline(path.basename(templateDirectory))}`,
    ),
  );
  console.log();

  const scripts = new Scripts({ testDirectory });

  const options = {
    stdio: 'inherit',
    env: {
      ...process.env,
      TEST_DIRECTORY: testDirectory,
      PORT: scripts.serverProcessPort,
    },
    cwd: templateDirectory,
  };

  const failures = [];

  async function testProductionBuild(watch = false, pattern) {
    // Test production build (CI env)
    try {
      console.log(chalk.blue(`> Building project for production`));
      console.log();

      await scripts.build(ciEnv);

      console.log();
      console.log(
        chalk.blue(`> Running app's own tests against production build`),
      );
      console.log();

      await scripts.test(ciEnv);

      console.log();
      console.log(chalk.blue(`> Running production integration tests`));
      console.log();

      const serveResult = await scripts.serve();

      try {
        await execa.shell(
          watch
            ? `${testProductionBuildScript} ${pattern} --watchAll`
            : testProductionBuildScript,
          options,
        );
      } finally {
        await serveResult.done();
      }
    } catch (error) {
      failures.push(error);
    }
  }

  async function testLocalDevelopment(watch = false, pattern) {
    // Test local build (local env)
    try {
      console.log();
      console.log(chalk.blue(`> Starting project for development`));
      console.log();

      const startResult = await scripts.start(localEnv);

      try {
        console.log();
        console.log(
          chalk.blue(`> Running app's own tests against development build`),
        );
        console.log();

        await scripts.test(localEnv);

        console.log();
        console.log(chalk.blue(`> Running development integration tests`));
        console.log();

        await execa.shell(
          watch
            ? `${testLocalDevelopmentScript} ${pattern} --watchAll`
            : testLocalDevelopmentScript,
          options,
        );
      } finally {
        await startResult.done();
      }
    } catch (error) {
      failures.push(error);
    }
  }

  async function runAdditionalTests(watch = false, pattern) {
    // Run additional tests (errors, analyze)
    if (
      await fs.pathExists(
        path.resolve(templateDirectory, 'jest.plain.config.js'),
      )
    ) {
      try {
        console.log();
        console.log(chalk.blue(`> Running additional integration tests`));
        console.log();

        await execa.shell(
          watch
            ? `${runAdditionalTestsScript} ${pattern} --watchAll`
            : runAdditionalTestsScript,
          options,
        );
      } catch (error) {
        failures.push(error);
      }
    }
  }

  if (watchMode) {
    // run relevant test by env (make sure env set)
    const pattern = typeof watchMode === 'string' ? watchMode : '';
    if (!buildMode) {
      await fs.remove(rootDirectory);
      throw new Error(
        `--buildMode must be provided in watch mode choose "production" or "development"`,
      );
    } else if (buildMode === 'production') {
      await testProductionBuild(watchMode, pattern);
    } else if (buildMode === 'development') {
      await testLocalDevelopment(watchMode, pattern);
    }
  } else {
    await testProductionBuild();
    await testLocalDevelopment();
    await runAdditionalTests();
    // Clean eventually
    await fs.remove(rootDirectory);
  }

  // Fail testing this project if any errors happened
  if (failures.length > 0) {
    throw new Error(failures.map(error => error.stack).join('\n\n'));
  }
};
