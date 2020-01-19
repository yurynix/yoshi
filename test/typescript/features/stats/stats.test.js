const path = require('path');
const fs = require('fs-extra');
const Scripts = require('../../../scripts');

jest.setTimeout(60 * 1000);

const scripts = Scripts.setupProjectFromTemplate({
  templateDir: __dirname,
  projectType: Scripts.projectType.TS,
});

describe.each(['prod'])('stats [%s]', mode => {
  it('integration', async () => {
    await scripts[mode](async () => {
      const statsFilePath = path.join(
        scripts.testDirectory,
        'target/webpack-stats.json',
      );

      expect(fs.existsSync(statsFilePath)).toBeTruthy();
    }, ['--stats']);
  });
});
