const path = require('path');
const Scripts = require('../../scripts');

const scripts = new Scripts({
  testDirectory: path.join(__dirname),
  silent: !process.env.DEBUG,
});

it.each(['serveWithCallback', 'startWithCallback'])(
  'externals %s',
  async command => {
    await scripts[command](async () => {
      await page.goto('http://localhost:3000');
      const result = await page.$eval('#externals', elm => elm.textContent);

      expect(result).toBe('Some external text.');
    });
  },
);
