const Scripts = require('../../../scripts');

const scripts = Scripts.setupProjectFromTemplate({
  templateDir: __dirname,
  projectType: Scripts.projectType.JS,
});

describe.each(['prod', 'dev'])('jest overrides [%s]', mode => {
  it('run tests', async () => {
    await scripts[mode](async () => {
      await scripts.test(mode);
    });
  });
});
