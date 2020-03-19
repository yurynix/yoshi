import path from 'path';
import resolveCwd from 'resolve-cwd';

export const isStylableDependencies = () => {
  return !!resolveCwd.silent('yoshi-stylable-dependencies/package.json');
};

export const getYoshiStylableDependenciesDir = () => {
  return path.dirname(resolveCwd('yoshi-stylable-dependencies/package.json'));
};
