import path from 'path';
// eslint-disable-next-line import/no-extraneous-dependencies
import * as babel from '@babel/core';
import globby from 'globby';
import fs from 'fs-extra';
import { BUILD_DIR } from 'yoshi-config/build/paths';
import copyFiles from 'yoshi-common/build/tsc/copy-files';

const ROOT_DIR = 'src';
const OUT_DIR = path.join(BUILD_DIR, 'cjs');

const stripExtension = (filePath: string) => {
  return filePath.replace(path.extname(filePath), '');
};

function transpileFile(filePath: string) {
  const abosoluteFilePath = path.join(process.cwd(), ROOT_DIR, filePath);

  const filePathInBuildDir = path.join(process.cwd(), OUT_DIR, filePath);

  const content = fs.readFileSync(abosoluteFilePath, 'utf-8');

  const relativeSourceFileName = path.relative(
    path.dirname(filePathInBuildDir),
    abosoluteFilePath,
  );

  const transpiledContent = babel.transform(content, {
    filename: filePathInBuildDir,
    sourceFileName: relativeSourceFileName,
    sourceMaps: true,
    plugins: ['@babel/plugin-transform-typescript'],
    presets: [['babel-preset-yoshi', { mode: 'test' }]],
  });

  const filePathInBuildDirNoExtensions = stripExtension(filePathInBuildDir);
  const mapFilePath = `${filePathInBuildDirNoExtensions}.js.map`;

  fs.outputFileSync(mapFilePath, JSON.stringify(transpiledContent?.map));

  const sourceMappingURLComment = `\n//# sourceMappingURL=${path.basename(
    mapFilePath,
  )}`;

  fs.outputFileSync(
    `${filePathInBuildDirNoExtensions}.js`,
    transpiledContent?.code + sourceMappingURLComment,
  );
}

export default () => {
  copyFiles({ watch: false, outDir: path.join(BUILD_DIR, 'cjs') });

  const tsFiles = globby.sync(['**/*.js', '**/*.ts', '**/*.tsx', '**/*.json'], {
    cwd: path.join(process.cwd(), ROOT_DIR),
  });

  tsFiles.forEach(transpileFile);
};
