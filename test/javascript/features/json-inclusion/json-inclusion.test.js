const Scripts = require('../../../scripts');

const scripts = Scripts.setupProjectFromTemplate({
  templateDir: __dirname,
});

describe.each(['prod', 'dev'])('json inclusion %s', mode => {
  it('integration', async () => {
    await scripts[mode](async () => {
      await page.goto('http://localhost:3000');

      const result = await page.$eval(
        '#json-inclusion',
        elm => elm.textContent,
      );

      expect(result).toBe('This is an abstract.');
    });
  });

  it('component tests', () => {
    scripts.test(mode);
  });
});

// it.each(['serveWithCallback', 'startWithCallback'])(
//   'json inclusion %s',
//   async command => {
//     await scripts[command](async () => {
//       await page.goto('http://localhost:3000');

//       const result = await page.$eval(
//         '#json-inclusion',
//         elm => elm.textContent,
//       );

//       expect(result).toBe('This is an abstract.');
//     });
//   },
// );
