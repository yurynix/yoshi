const Scripts = require('../../../../scripts');

const scripts = Scripts.setupProjectFromTemplate({
  templateDir: __dirname,
  projectType: Scripts.projectType.TS,
});

describe.each(['prod'])('fails with case sensitive imports [%s]', mode => {
  it('integration', async () => {
    try {
      await scripts[mode]();
    } catch (error) {
      if (process.platform === 'darwin') {
        expect(error.message).toMatch(
          "Cannot find file: 'clientcasesensitive.tsx' does not match the " +
            "corresponding name on disk: './src/clientCaseSensitive.tsx'.",
        );
      } else {
        expect(error.message).toMatch(
          "Module not found: Can't resolve './clientcasesensitive'",
        );
      }
    }
  });
});
