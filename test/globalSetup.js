const path = require('path');
const execa = require('execa');
const fs = require('fs-extra');
const tempy = require('tempy');
const {
  publishMonorepo,
  authenticateToRegistry,
} = require('../scripts/utils/publishMonorepo');
const { setup: setupPuppeteer } = require('jest-environment-puppeteer');
const { tmpDirectory } = require('./utils');

module.exports = async globalConfig => {
  // Empty the folder
  fs.emptyDirSync(tmpDirectory);

  await setupPuppeteer(globalConfig);
  const isPublish = !!process.env.WITH_PUBLISH;
  if (isPublish) {
    global.teardown = publishMonorepo();
    global.yoshiPublishDir = tempy.directory();
    await fs.copy(
      path.join(__dirname, 'yoshi-publish'),
      global.yoshiPublishDir,
    );

    authenticateToRegistry(global.yoshiPublishDir);
    await execa('npm install', {
      cwd: global.yoshiPublishDir,
      shell: true,
      stdio: !process.env.DEBUG ? 'pipe' : 'inherit',
      extendEnv: false,
      env: {
        PATH: process.env.PATH,
      },
    });
  }
};
