const Scripts = require('../../../../../scripts');

const scripts = Scripts.setupProjectFromTemplate({
  templateDir: __dirname,
  projectType: Scripts.projectType.JS,
});

describe.each(['prod', 'dev'])('return a string [%s]', mode => {
  it('run tests', async () => {
    await scripts[mode](async () => {
      await page.goto(`${scripts.serverUrl}/app`);
      const title = await page.$eval('h1', elm => elm.innerText);
      expect(title).toBe('hello Yaniv');
    });
  });
});
