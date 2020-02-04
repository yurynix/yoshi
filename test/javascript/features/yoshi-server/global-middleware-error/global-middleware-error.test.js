const Scripts = require('../../../../scripts');

const scripts = Scripts.setupProjectFromTemplate({
  templateDir: __dirname,
  projectType: Scripts.projectType.YOSHI_SERVER_JS,
});

describe.each(['prod', 'dev'])(
  'yoshi-server global middleware error [%s]',
  mode => {
    it('run tests', async () => {
      await scripts[mode](async () => {
        await page.goto(`${scripts.serverUrl}/app`);
        const title = await page.$eval('.error-message', elm => elm.innerText);
        expect(title).toBe('there was an error!');
      });
    });
  },
);
