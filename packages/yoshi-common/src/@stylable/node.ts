import importFrom from 'import-from';
import {
  isStylableDependencies,
  getYoshiStylableDependenciesDir,
} from './utils';

function getStylableModuleFactory() {
  if (isStylableDependencies()) {
    // @ts-ignore return type of importFrom is unknown
    return importFrom(
      getYoshiStylableDependenciesDir(),
      '@stylable/module-utils',
    ).stylableModuleFactory;
  }

  return require('@stylable/node').stylableModuleFactory;
}

function getStylableResolveNamespaceFactory() {
  if (isStylableDependencies()) {
    // @ts-ignore return type of importFrom is unknown
    return importFrom(getYoshiStylableDependenciesDir(), '@stylable/node')
      .resolveNamespaceFactory;
  }

  return require('@stylable/node').resolveNamespaceFactory;
}

export const stylableModuleFactory = getStylableModuleFactory();
export const resolveNamespaceFactory = getStylableResolveNamespaceFactory();
