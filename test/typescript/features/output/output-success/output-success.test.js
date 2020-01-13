const Scripts = require('../../../../scripts');

const scripts = Scripts.setupProjectFromTemplate({
  templateDir: __dirname,
  projectType: Scripts.projectType.TS,
});

describe.each(['prod'])('output - runs successfully [%s]', mode => {
  it('integration', async () => {
    await scripts[mode](async result => {
      expect(result.stdout).toMatch('Compiled successfully.');
      expect(result.stdout).toMatch('Interested in reducing your bundle size?');
    });
  });
});
