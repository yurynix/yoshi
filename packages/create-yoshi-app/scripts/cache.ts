// @ts-ignore
import findCacheDir from 'find-cache-dir';
import fs from 'fs-extra';
import { appCacheDirname, appCacheKey } from '../src/constants';

// '/some/path/node_modules/.cache/create-yoshi-app'
const thunk = findCacheDir({ name: appCacheDirname, thunk: true });

const addJsonSuffix = (str: string) => str + '.json';
const getCachePath = (key: string) => thunk(addJsonSuffix(key));

// module.exports.clear = () => {
//   fs.rmdirSync(thunk());
// };

const cachePath = getCachePath(appCacheKey);

export const set = (obj: any) => {
  return fs.outputFileSync(cachePath, JSON.stringify(obj));
};

export const get = () => {
  return fs.readJsonSync(cachePath);
};

export const has = () => {
  return fs.existsSync(cachePath);
};
