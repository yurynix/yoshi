const Scripts = require('../../../scripts');
const { request } = require('../../../utils');

const scripts = Scripts.setupProjectFromTemplate({
  templateDir: __dirname,
  projectType: Scripts.projectType.JS,
});

describe.each(['prod', 'dev'])('static assets [%s]', mode => {
  it('serves static assets', async () => {
    await scripts[mode](async () => {
      expect(await request('http://localhost:3200/assets/hello.txt')).toBe(
        'Hello from public folder!',
      );
    });
  });
});
