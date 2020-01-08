const path = require('path');
const execa = require('execa');
const fs = require('fs-extra');
const {
  waitForPort,
  waitForStdout,
  terminateAsyncSafe,
  terminateAsync,
  tmpDirectory,
  replaceTemplates,
} = require('./utils');
const { ciEnv, localEnv } = require('../scripts/utils/constants');

const isPublish = !!process.env.WITH_PUBLISH;

const defaultOptions = {
  BROWSER: 'none',
};

const yoshiBin = require.resolve('../packages/yoshi/bin/yoshi-cli');

module.exports = class Scripts {
  constructor({ testDirectory }) {
    this.silent = !process.env.DEBUG;
    this.testDirectory = testDirectory;
    this.serverProcessPort = 3000;
    this.staticsServerPort = 3200;
    this.yoshiPublishDir = isPublish
      ? `${global.yoshiPublishDir}/node_modules`
      : path.join(__dirname, '../packages/yoshi-flow-legacy/node_modules');
  }

  static setupProjectFromTemplate({ templateDir }) {
    // The test will run in '.tmp' folder. For example: '.tmp/javascript/features/css-inclusion'
    const featureDir = path.join(
      tmpDirectory,
      templateDir.replace(__dirname, ''),
    );
    // Create a folder for the specific feature, if does not exist
    fs.ensureDirSync(featureDir);
    // Copy the base template
    fs.copySync(
      path.join(templateDir, '../../fixtures/base-template'),
      featureDir,
    );
    // Copy the specific feature template, with override
    fs.copySync(templateDir, featureDir, {
      overwrite: true,
      filter: file => !file.includes('.test.js'),
    });

    //Process tsconfig template for dynamic content
    const tsConfigPath = path.join(featureDir, 'tsconfig.json');
    if (fs.pathExistsSync(tsConfigPath)) {
      const templateData = {
        yoshiRootPath: path.join(__dirname, '../packages/yoshi'),
      };
      const fileContents = fs.readFileSync(tsConfigPath, 'utf-8');
      const transformedContents = replaceTemplates(fileContents, templateData);
      fs.outputFileSync(tsConfigPath, transformedContents);
    }

    if (fs.pathExistsSync(path.join(featureDir, '__node_modules__'))) {
      fs.moveSync(
        path.join(featureDir, '__node_modules__'),
        path.join(featureDir, 'node_modules'),
      );
    }

    return new Scripts({ testDirectory: featureDir });
  }

  async dev(callback = () => {}) {
    const startProcess = execa(
      'node',
      [yoshiBin, 'start', '--server', './dist/server.js'],
      {
        cwd: this.testDirectory,
        env: {
          PORT: this.serverProcessPort,
          NODE_PATH: this.yoshiPublishDir,
          ...defaultOptions,
        },
      },
    );

    // `startProcess` will never resolve but if it fails this
    // promise will reject immediately
    try {
      await Promise.race([
        waitForStdout(startProcess, 'Compiled with warnings').then(data => {
          throw new Error(
            `Yoshi start was compiled with warnings \n \n ${data}`,
          );
        }),
        waitForStdout(startProcess, 'Failed to compile').then(data => {
          throw new Error(`Yoshi start failed to compile: \n \n ${data}`);
        }),
        Promise.all([
          waitForPort(this.serverProcessPort, { timeout: 60 * 1000 }),
          waitForPort(this.staticsServerPort, { timeout: 60 * 1000 }),
          waitForStdout(startProcess, 'Compiled successfully!'),
        ]),
        startProcess,
      ]);

      await callback();
    } finally {
      await terminateAsyncSafe(startProcess.pid);
    }
  }

  analyze(env = {}) {
    const buildProcess = execa('node', [yoshiBin, 'build', '--analyze'], {
      cwd: this.testDirectory,
      env: {
        ...defaultOptions,
        ...env,
      },
      stdio: this.silent ? 'pipe' : 'inherit',
    });

    return {
      done() {
        return terminateAsync(buildProcess.pid);
      },
    };
  }

  async build(env = {}, args = []) {
    let buildResult;

    try {
      buildResult = await execa('node', [yoshiBin, 'build', ...args], {
        cwd: this.testDirectory,
        env: {
          ...defaultOptions,
          ...env,
        },
        all: true,
      });
    } catch (e) {
      throw new Error(e.all);
    }

    if (buildResult.stdout.includes('Compiled with warnings')) {
      throw new Error(
        `Yoshi build was compiled with warnings: \n ${buildResult.stdout}`,
      );
    }

    return buildResult;
  }

  async test(mode) {
    const env = mode === 'prod' ? ciEnv : localEnv;
    let res;
    try {
      res = await execa('node', [yoshiBin, 'test'], {
        cwd: this.testDirectory,
        all: true,
        env: {
          NODE_PATH: this.yoshiPublishDir,
          ...defaultOptions,
          ...env,
        },
      });
    } catch (e) {
      throw new Error(e.all);
    }
    return res;
  }

  // Used in "old" kitchensync tests
  async start(env) {
    const startProcess = execa('npx', ['yoshi', 'start'], {
      cwd: this.testDirectory,
      // stdio: 'inherit',
      env: {
        PORT: this.serverProcessPort,
        ...defaultOptions,
        ...env,
      },
    });

    // `startProcess` will never resolve but if it fails this
    // promise will reject immediately
    await Promise.race([
      Promise.all([
        waitForPort(this.serverProcessPort, { timeout: 60 * 1000 }),
        waitForPort(this.staticsServerPort, { timeout: 60 * 1000 }),
        waitForStdout(startProcess, 'Compiled successfully!'),
      ]),
      startProcess,
    ]);

    return {
      port: this.serverProcessPort,
      done() {
        return terminateAsync(startProcess.pid);
      },
    };
  }

  // Used in "old" kitchensync tests
  async serve() {
    const staticsServerProcess = execa(
      'npx',
      ['serve', '-p', this.staticsServerPort, '-s', 'dist/statics/'],
      {
        cwd: this.testDirectory,
        stdio: this.silent ? 'pipe' : 'inherit',
      },
    );

    const appServerProcess = execa('node', ['index.js'], {
      cwd: this.testDirectory,
      stdio: this.silent ? 'pipe' : 'inherit',
      env: {
        PORT: this.serverProcessPort,
      },
    });

    await Promise.all([
      waitForPort(this.staticsServerPort),
      waitForPort(this.serverProcessPort),
    ]);

    return {
      staticsServerPort: this.staticsServerPort,
      appServerProcessPort: this.serverProcessPort,
      done() {
        return Promise.all([
          terminateAsyncSafe(staticsServerProcess.pid),
          terminateAsyncSafe(appServerProcess.pid),
        ]);
      },
    };
  }

  async prod(callback = () => {}) {
    try {
      await this.build(ciEnv);
    } catch (e) {
      throw new Error(e);
    }

    const staticsServerProcess = execa(
      'npx',
      ['serve', '-p', this.staticsServerPort, '-s', 'dist/statics/'],
      {
        cwd: this.testDirectory,
      },
    );

    const appServerProcess = execa('node', ['./dist/server.js'], {
      cwd: this.testDirectory,
      stdio: this.silent ? 'pipe' : 'inherit',
      env: {
        NODE_PATH: this.yoshiPublishDir,
        PORT: this.serverProcessPort,
      },
    });

    await Promise.all([
      waitForPort(this.staticsServerPort),
      waitForPort(this.serverProcessPort),
    ]);

    try {
      await callback();
    } finally {
      await Promise.all([
        terminateAsyncSafe(staticsServerProcess.pid),
        terminateAsyncSafe(appServerProcess.pid),
      ]);
    }
  }
};
