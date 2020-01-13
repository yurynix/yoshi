const Scripts = require('../../../../scripts');

const scripts = Scripts.setupProjectFromTemplate({
  templateDir: __dirname,
  projectType: Scripts.projectType.JS,
});

describe.each(['prod'])('fails with babel syntax errors [%s]', mode => {
  it('integration', async () => {
    try {
      await scripts[mode]();
    } catch (error) {
      expect(error.message).toMatch('Unexpected token (1:9)');
    }
  });
});
