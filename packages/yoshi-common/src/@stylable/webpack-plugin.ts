import importFrom from 'import-from';
import {
  isStylableDependencies,
  getYoshiStylableDependenciesDir,
} from './utils';

function getStylableWebpackPlugin() {
  if (isStylableDependencies()) {
    // @ts-ignore return type of importFrom is unknown
    return importFrom(
      getYoshiStylableDependenciesDir(),
      '@stylable/webpack-plugin',
    ).StylableWebpackPlugin;
  }

  return require('@stylable/webpack-plugin');
}

export default getStylableWebpackPlugin();
