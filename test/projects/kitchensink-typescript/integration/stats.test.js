const path = require('path');
const fs = require('fs-extra');
const { localEnv } = require('../../../../scripts/utils/constants');

jest.setTimeout(60 * 1000);

describe('stats', () => {
  describe('build', () => {
    it('generates webpack stats file', async () => {
      await global.scripts.build({});

      const statsFilePath = path.join(
        process.env.TEST_DIRECTORY,
        'target/webpack-stats.json',
      );

      expect(fs.existsSync(statsFilePath)).toBeTruthy();
    });
  });
  describe('start', () => {
    let startResult;
    afterEach(async () => {
      if (startResult) {
        await startResult.done();
      }
    });

    it('generates webpack stats file', async () => {
      startResult = await global.scripts.start(localEnv);

      const statsFilePath = path.join(
        process.env.TEST_DIRECTORY,
        'target/webpack-stats.json',
      );

      expect(fs.existsSync(statsFilePath)).toBeTruthy();
    });
  });
});
