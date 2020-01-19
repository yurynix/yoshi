const Scripts = require('../../../scripts');

const scripts = Scripts.setupProjectFromTemplate({
  templateDir: __dirname,
  projectType: Scripts.projectType.TS,
});

jest.setTimeout(40000);

describe.each(['prod', 'dev'])('e2e [%s]', mode => {
  it('run tests', async () => {
    await scripts[mode](async () => {
      await scripts.test(mode);
    });
  });
});
