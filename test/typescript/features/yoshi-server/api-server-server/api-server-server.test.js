const Scripts = require('../../../../scripts');

const scripts = Scripts.setupProjectFromTemplate({
  templateDir: __dirname,
  projectType: Scripts.projectType.TS,
});

describe.each(['prod', 'dev'])(
  'yoshi-server api server to server [%s]',
  mode => {
    it('run tests', async () => {
      await scripts[mode](async () => {
        await page.goto(`http://localhost:3000/app`);
        const title = await page.$eval('h1', elm => elm.innerText);
        expect(title).toBe('hello Yaniv');
      });
    });
  },
);
