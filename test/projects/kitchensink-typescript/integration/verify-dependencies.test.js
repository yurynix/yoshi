const path = require('path');
const merge = require('lodash/merge');
const fs = require('fs-extra');
const { ciEnv, localEnv } = require('../../../../scripts/utils/constants');

jest.setTimeout(60 * 1000);

const originalFilePath = path.join(
  global.scripts.testDirectory,
  'package.json',
);

const originalContent = fs.readFileSync(originalFilePath, 'utf-8');

async function replacePackageJsonData(data) {
  const packageJsonData = JSON.parse(originalContent);
  await fs.writeFile(
    originalFilePath,
    JSON.stringify(merge(packageJsonData, data)),
  );
}

describe('verify dependencies', () => {
  afterEach(() => {
    // reset state back to normal after every test
    fs.writeFileSync(originalFilePath, originalContent);
  });

  describe('build', () => {
    [
      { name: 'localEnv', env: localEnv },
      { name: 'ciEnv', env: ciEnv },
    ].forEach(({ name, env }) => {
      it(`Default configuration should not throw warnings [${name}]`, async () => {
        const result = await global.scripts.build(env);
        expect(result.stderr).toBeFalsy();
      });
      it(`should warn in case yoshi stated in dependencies [${name}]`, async () => {
        replacePackageJsonData({ dependencies: { yoshi: '1.0.0' } });
        const result = await global.scripts.build(env);
        expect(result.stderr).toMatch(
          "You have stated yoshi in 'dependencies', this may cause issues with consumers. please move yoshi to devDependencies",
        );
      });
    });
  });
});
