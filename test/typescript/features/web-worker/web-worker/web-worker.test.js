const Scripts = require('../../../../scripts');

const scripts = Scripts.setupProjectFromTemplate({
  templateDir: __dirname,
  projectType: Scripts.projectType.TS,
});

describe.each(['prod', 'dev'])('web-worker [%s]', mode => {
  it('integration', async () => {
    await scripts[mode](async () => {
      await page.goto(`http://localhost:3000`);
      await page.waitForSelector('h1');
      expect(await page.$eval('h1', el => el.innerText)).toBe(
        'hello from a web worker',
      );
    });
  });
});
