const Scripts = require('../../../scripts');

const scripts = Scripts.setupProjectFromTemplate({
  templateDir: __dirname,
  projectType: Scripts.projectType.JS,
});

describe.each(['prod'])('verify dependencies [%s]', mode => {
  it('Default configuration should not throw warnings', async () => {
    await scripts[mode](async buildResult => {
      expect(buildResult.stderr).toMatch(
        "You have stated yoshi in 'dependencies', this may cause issues with consumers. please move yoshi to devDependencies",
      );
    });
  });
});
