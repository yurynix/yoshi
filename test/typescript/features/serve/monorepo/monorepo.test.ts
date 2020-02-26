import Scripts from '../../../../scripts';

const scripts = Scripts.setupProjectFromTemplate({
  templateDir: __dirname,
  projectType: 'javascript',
});

describe('Yoshi serve monorepo', () => {
  it('should throw an error that monorepo flow is not supported', async () => {
    expect.assertions(1);

    await scripts.serve(
      () => Promise.resolve(),
      e => expect(e).toEqual('Error: yoshi-flow-monorepo is not supported yet'),
    );
  });
});
