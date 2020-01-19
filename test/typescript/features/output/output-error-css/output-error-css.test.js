const Scripts = require('../../../../scripts');

const scripts = Scripts.setupProjectFromTemplate({
  templateDir: __dirname,
  projectType: Scripts.projectType.TS,
});

describe.each(['prod'])('fails with css syntax errors [%s]', mode => {
  it('integration', async () => {
    try {
      await scripts[mode]();
    } catch (error) {
      expect(error.message).toMatch('Unclosed block');
    }
  });
});
