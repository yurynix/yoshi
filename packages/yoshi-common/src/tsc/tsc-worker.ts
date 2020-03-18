import path from 'path';
import { BUILD_DIR } from 'yoshi-config/build/paths';
import TscProcess from './tsc-process';
import copyFiles from './copy-files';
import { enforceTsconfig } from './tsconfig-enforcer';

const outDir = path.join(BUILD_DIR, 'es');

export const watch = () => {
  enforceTsconfig();

  const tscProcess = new TscProcess();

  tscProcess.watch();

  copyFiles({ watch: true, outDir });

  return tscProcess;
};

export const build = (): Promise<any> => {
  enforceTsconfig();
  const tscProcess = new TscProcess();

  copyFiles({ watch: false, outDir });
  return tscProcess.build();
};
