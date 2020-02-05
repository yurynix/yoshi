import path from 'path';
import execa from 'execa';
import { testRegistry } from './constants';

export function publishMonorepo() {
  // Start in root directory even if run from another directory
  process.chdir(path.join(__dirname, '../..'));

  const verdaccio = execa('npx verdaccio --config verdaccio.yaml', {
    shell: true,
  });

  execa.sync('npx wait-port 4873 -o silent', { shell: true });

  execa.sync(
    `npx lerna exec 'npx npm-auth-to-token -u user -p password -e user@example.com -r "${testRegistry}"'`,
    { shell: true },
  );

  execa.sync(
    `npx lerna exec 'node ../../packages/create-yoshi-app/scripts/verifyPublishConfig.js'`,
    { shell: true },
  );

  execa.sync(
    `npx lerna publish minor --yes --loglevel=warn --force-publish=* --no-git-tag-version --no-push --exact --dist-tag=latest --registry="${testRegistry}"`,
    {
      stdio: 'inherit',
      shell: true,
    },
  );

  // Return a cleanup function
  return () => {
    execa.sync(`kill -9 ${verdaccio.pid}`, { shell: true });
  };
}

export function authenticateToRegistry(cwd: string) {
  execa.sync(
    `npx npm-auth-to-token -u user -p password -e user@example.com -r "${testRegistry}"`,
    { cwd, shell: true },
  );
}
