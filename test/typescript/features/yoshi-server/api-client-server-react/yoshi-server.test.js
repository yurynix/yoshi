const Scripts = require('../../../../scripts');

const scripts = Scripts.setupProjectFromTemplate({
  templateDir: __dirname,
  projectType: Scripts.projectType.YOSHI_SERVER_TS,
});

describe.each(['prod', 'dev'])(
  'yoshi-server api client to server, react[%s]',
  mode => {
    it('run tests', async () => {
      await scripts[mode](async () => {
        await page.goto(`${scripts.serverUrl}/app`);
        await page.waitForSelector('h2');
        const title = await page.$eval('h2', elm => elm.innerText);
        expect(title).toBe('hello Yaniv');
      });
    });
  },
);
