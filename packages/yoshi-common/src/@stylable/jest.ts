import importFrom from 'import-from';
import {
  isStylableDependencies,
  getYoshiStylableDependenciesDir,
} from './utils';

function getStylableJest() {
  if (isStylableDependencies()) {
    return importFrom(getYoshiStylableDependenciesDir(), '@stylable/jest');
  }

  return require('@stylable/jest');
}

export = getStylableJest();
