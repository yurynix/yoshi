const Scripts = require('../../../../../scripts');

const scripts = Scripts.setupProjectFromTemplate({
  templateDir: __dirname,
  projectType: Scripts.projectType.YOSHI_SERVER_JS,
});

describe.each(['prod', 'dev'])('send a value directly [%s]', mode => {
  it('integration', async () => {
    await scripts[mode](async () => {
      await page.goto(`${scripts.serverUrl}/app`);
      const title = await page.$eval('h1', elm => elm.innerText);
      expect(title).toBe('hello Yaniv');
    });
  });

  it('have only one header', async () => {
    await scripts[mode](async () => {
      await page.goto(`${scripts.serverUrl}/app`);
      const titles = await page.$$('h1');
      expect(titles.length).toBe(1);
    });
  });
});
