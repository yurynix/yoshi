const path = require('path');
const { matchCSS, initTest } = require('../../utils');
const Scripts = require('../../scripts');
const { localEnv } = require('../../../scripts/utils/constants');

const scripts = new Scripts({
  testDirectory: path.join(__dirname),
  silent: !process.env.DEBUG,
});

describe('css-inclusion', () => {
  it.each(['serveWithCallback', 'startWithCallback'])(
    'css inclusion %s',
    async command => {
      await scripts[command](async () => {
        await initTest('css-inclusion');

        const className = await page.$eval('#css-inclusion', elm =>
          elm.getAttribute('class'),
        );

        await matchCSS('css-inclusion', page, [
          new RegExp(`.${className}{background:#ccc;color:#000;*}`),
        ]);
      });
    },
  );

  it('should run component test', async () => {
    //any reason to run this one in ciEnv as well?
    await scripts.test(localEnv);
  });
});

describe('json inclusion', () => {
  it.each(['serveWithCallback', 'startWithCallback'])(
    'json inclusion %s',
    async command => {
      await scripts[command](async () => {
        await initTest('json-inclusion');

        const result = await page.$eval(
          '#json-inclusion',
          elm => elm.textContent,
        );

        expect(result).toBe('This is an abstract.');
      });
    },
  );
});
