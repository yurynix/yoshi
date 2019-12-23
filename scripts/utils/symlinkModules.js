const fs = require('fs-extra');
const path = require('path');
const execa = require('execa');
const virtualDirectory = require('virtual-directory').default;

const getYoshiPackages = () => {
  const { stdout: rawPackages } = execa.sync('npx lerna list --all --json', {
    shell: true,
  });

  return JSON.parse(rawPackages);
};

module.exports.getYoshiModulesList = () => getYoshiPackages().map(x => x.name);

module.exports.symlinkModules = async repoDirectory => {
  const parentDirectory = path.dirname(repoDirectory);

  // Link yoshi's node_modules to the parent directory of the tested module
  await virtualDirectory(
    path.join(__dirname, '../../node_modules'),
    path.join(parentDirectory, 'node_modules'),
    [
      '@types/react',
      '@types/react-dom',
      'node_modules/yoshi-flow-legacy/node_modules/@types/react',
    ],
  );

  const symlinkPackage = packageName => {
    fs.removeSync(path.join(repoDirectory, 'node_modules', packageName));
    fs.ensureSymlinkSync(
      path.join(__dirname, '../../packages', packageName),
      path.join(repoDirectory, 'node_modules', packageName),
    );
  };

  const symlinkPackageBins = packageDir => {
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
