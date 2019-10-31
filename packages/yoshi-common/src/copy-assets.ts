import path from 'path';
import fs from 'fs-extra';
import globby from 'globby';
import chokidar from 'chokidar';
import {
  STATICS_DIR,
  SRC_DIR,
  PUBLIC_DIR,
  ASSETS_DIR,
} from 'yoshi-config/paths';

export async function copyTemplates(cwd = process.cwd()) {
  const files = await globby('**/*.{ejs,vm}', { cwd: path.join(cwd, SRC_DIR) });

  await Promise.all(
    files.map(file => {
      return fs.copy(
        path.join(cwd, SRC_DIR, file),
        path.join(cwd, STATICS_DIR, file),
      );
    }),
  );
}

export function watchPublicFolder(cwd = process.cwd()) {
  const watcher = chokidar.watch(path.join(cwd, PUBLIC_DIR), {
    persistent: true,
    ignoreInitial: false,
    cwd: path.join(cwd, PUBLIC_DIR),
  });

  const copyFile = (relativePath: string) => {
    return fs.copy(
      path.join(cwd, PUBLIC_DIR, relativePath),
      path.join(cwd, ASSETS_DIR, relativePath),
    );
  };

  const removeFile = (relativePath: string) => {
    return fs.remove(path.join(cwd, ASSETS_DIR, relativePath));
  };

  watcher.on('change', copyFile);
  watcher.on('add', copyFile);
  watcher.on('unlink', removeFile);
}
