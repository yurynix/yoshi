const Scripts = require('../../../../scripts');

const scripts = Scripts.setupProjectFromTemplate({
  templateDir: __dirname,
  projectType: Scripts.projectType.TS,
});

describe.each(['prod'])('fails with typescript syntax errors [%s]', mode => {
  it('integration', async () => {
    try {
      await scripts[mode]();
    } catch (error) {
      expect(error.message).toMatch('Type error: Expression expected');
    }
  });
});
