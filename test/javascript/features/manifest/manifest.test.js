const path = require('path');
const fs = require('fs-extra');
const Scripts = require('../../../scripts');

const scripts = Scripts.setupProjectFromTemplate({
  templateDir: __dirname,
  projectType: Scripts.projectType.JS,
});

describe.each(['prod', 'dev'])('manifest [%s]', mode => {
  it('generates manifest stat file for non optimized', async () => {
    await scripts[mode](async () => {
      const statsFilePath = path.join(
        scripts.testDirectory,
        'dist/statics/manifest.json',
      );

      const json = JSON.parse(fs.readFileSync(statsFilePath, 'utf-8'));

      expect(json).toMatchSnapshot();
    });
  });
});

describe.each(['prod'])('manifest [%s]', mode => {
  it('generates manifest stat file for optimized', async () => {
    await scripts[mode](async () => {
      const statsFilePath = path.join(
        scripts.testDirectory,
        'dist/statics/manifest.min.json',
      );

      const json = JSON.parse(fs.readFileSync(statsFilePath, 'utf-8'));

      expect(json).toMatchSnapshot();
    });
  });
});
