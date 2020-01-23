const Scripts = require('../../../../scripts');

const scripts = Scripts.setupProjectFromTemplate({
  templateDir: __dirname,
  projectType: Scripts.projectType.JS,
});

describe.each(['prod', 'dev'])('yoshi-server [%s]', mode => {
  it('run tests', async () => {
    await scripts[mode](async () => {
      //
    });
  });
});
