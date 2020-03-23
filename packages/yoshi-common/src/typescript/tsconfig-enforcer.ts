import path from 'path';
import fs from 'fs-extra';
import defaultsDeep from 'lodash/defaultsDeep';
import isEqual from 'lodash/isEqual';
import { SRC_DIR, ES_DIR, TYPES_DIR } from 'yoshi-config/build/paths';

export const enforceTsconfig = ({ cwd }: { cwd: string }) => {
  const enforcedTsconfigOptions = {
    include: [SRC_DIR],
    compilerOptions: {
      target: 'ESNext',
      module: 'esnext',
      lib: ['dom', 'esnext'],
      moduleResolution: 'node',
      rootDir: SRC_DIR,
      outDir: ES_DIR,
      declarationDir: TYPES_DIR,
      declaration: true,
      sourceMap: true,
      importHelpers: true,
      esModuleInterop: true,
      jsx: 'react',
    },
  };

  const userTsconfigPath = path.join(cwd, 'tsconfig.json');
  const userTsconfig = fs.readJSONSync(userTsconfigPath);
  const mergedTsconfig = defaultsDeep(enforcedTsconfigOptions, userTsconfig);

  // if there's a change in tsconfig, write the new one
  if (!isEqual(mergedTsconfig, userTsconfig)) {
    console.log('');
    console.log('> differences were found between tsconfig.json options');
    console.log(
      '> rewriting tsconfig.json with "yoshi-flow-library\'s options',
    );
    console.log('');

    fs.outputFileSync(
      userTsconfigPath,
      JSON.stringify(mergedTsconfig, null, 2),
    );
  }
};
