import path from 'path';
import fs from 'fs-extra';

export const isTypescriptProject = () =>
  fs.existsSync(path.resolve('tsconfig.json'));
