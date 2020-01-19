const Scripts = require('../../../../scripts');

const scripts = Scripts.setupProjectFromTemplate({
  templateDir: __dirname,
  projectType: Scripts.projectType.JS,
});

describe.each(['prod'])('fails when client entry does not exist [%s]', mode => {
  it('integration', async () => {
    try {
      await scripts[mode]();
    } catch (error) {
      expect(error.message).toMatch(
        "(client) Entry module not found: Error: Can't resolve './nonExists'",
      );
    }
  });
});
