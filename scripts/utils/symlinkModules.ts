import path from 'path';
import fs from 'fs-extra';
import execa from 'execa';

const getYoshiPackages = (): Array<{ name: string; location: string }> => {
  const { stdout: rawPackages } = execa.sync('npx lerna list --all --json', {
    shell: true,
  });

  return JSON.parse(rawPackages);
};

export const getYoshiModulesList = () => getYoshiPackages().map(x => x.name);

export const symlinkModules = (repoDirectory: string) => {
  const parentDirectory = path.dirname(repoDirectory);

  // Link yoshi's node_modules to the parent directory of the tested module
  fs.ensureSymlinkSync(
    path.join(__dirname, '../../node_modules'),
    path.join(parentDirectory, 'node_modules'),
  );

  const symlinkPackage = (packageName: string) => {
    fs.removeSync(path.join(repoDirectory, 'node_modules', packageName));
    fs.ensureSymlinkSync(
      path.join(__dirname, '../../packages', packageName),
      path.join(repoDirectory, 'node_modules', packageName),
    );
  };

  const symlinkPackageBins = (packageDir: string) => {
    const { bin: bins = {} } = fs.readJSONSync(
      path.join(packageDir, 'package.json'),
    );

    Object.keys(bins).forEach(bin =>
      fs.ensureSymlinkSync(
        path.join(packageDir, bins[bin]),
        path.join(repoDirectory, `node_modules/.bin/${bin}`),
      ),
    );
  };

  getYoshiPackages().forEach(({ name, location }) => {
    const pkg = fs.readJsonSync(path.join(repoDirectory, 'package.json'));
    const { dependencies = {}, devDependencies = {} } = pkg;

    if (devDependencies[name] || dependencies[name]) {
      symlinkPackage(name);

      if (devDependencies[name]) {
        symlinkPackageBins(location);
      }
    }
  });
};
