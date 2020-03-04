import path from 'path';

export const isStylableDependencies = () => {
  try {
    require.resolve('yoshi-stylable-dependencies/package.json');
    return true;
  } catch (error) {
    return false;
  }
};

export const getYoshiStylableDependenciesDir = () => {
  return path.dirname(
    require.resolve('yoshi-stylable-dependencies/package.json'),
  );
};
