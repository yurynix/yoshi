const fs = require('fs-extra');
const path = require('path');

const Scripts = require('../../../../scripts');

const scripts = Scripts.setupProjectFromTemplate({
  templateDir: __dirname,
  projectType: Scripts.projectType.JS,
});

const originalServerFilePath = path.join(
  scripts.testDirectory,
  'src/server.js',
);

describe.each(['prod'])('fails when server entry does not exist [%s]', mode => {
  it('integration', async () => {
    try {
      await fs.remove(originalServerFilePath);

      await scripts[mode]();
    } catch (error) {
      expect(error.message).toMatch("We couldn't find your server entry");
    }
  });
});
