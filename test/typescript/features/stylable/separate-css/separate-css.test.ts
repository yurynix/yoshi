import axios from 'axios';
import Scripts from '../../../../scripts';

const scripts = Scripts.setupProjectFromTemplate({
  templateDir: __dirname,
  projectType: 'typescript',
});

describe.each(['prod', 'dev'] as const)('stylable separate css [%s]', mode => {
  it('outputs stylable into a separate css file', async () => {
    await scripts[mode](async () => {
      const { data: res } = await axios(
        'http://localhost:3200/app.stylable.bundle.css',
      );
      expect(res).toContain('root{height:100vh}');
    });
  });
});
