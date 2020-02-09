import Scripts from '../../../../scripts';

const scripts = Scripts.setupProjectFromTemplate({
  templateDir: __dirname,
  projectType: 'javascript',
});

it('Should display informative error in story', async () => {
  await expect(scripts.dev()).rejects.toThrow(
    `> 8 | export const Basic = () => <Component />asd;;`,
  );
});
