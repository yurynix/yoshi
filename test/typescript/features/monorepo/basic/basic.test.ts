import Scripts from '../../../../scripts';

const scripts = Scripts.setupProjectFromTemplate({
  templateDir: __dirname,
  projectType: 'monorepo-typescript',
});

describe('monorepo', () => {
  it('basic integration [prod]', async () => {
    await scripts.prod(
      async () => {
        await page.goto(`${scripts.serverUrl}`);
        const innerHTML = await page.$eval('#name', elm => elm.textContent);

        expect(innerHTML).toEqual('Hello World!');
      },
      {
        staticsDir: 'packages/app/dist/statics',
      },
    );
  });

  it('basic integration [dev]', async () => {
    await scripts.dev(
      async () => {
        await page.goto(`${scripts.serverUrl}`);
        const innerHTML = await page.$eval('#name', elm => elm.textContent);

        expect(innerHTML).toEqual('Hello World!');
      },
      { extraStartArgs: ['monorepo-app'] },
    );
  });
});
