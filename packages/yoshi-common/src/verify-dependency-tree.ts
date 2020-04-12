import chalk from 'chalk';
import resolveFrom from 'resolve-from';
import readPkgUp from 'read-pkg-up';

type DepConflict = {
  dep: string;
  localVersion: string;
  rootVersion: string;
};

function logDepConflicts(conflicts: Array<DepConflict>) {
  console.error(`🚨 Yoshi has detected dependency version conflicts! 🚨`);
  console.error('\n');

  for (const { dep, localVersion, rootVersion } of conflicts) {
    console.error(
      ` ${chalk.grey('*')} Yoshi's version: ${chalk.cyan(
        dep,
      )} @ ${chalk.greenBright(localVersion)}`,
    );
    console.error(
      `   Project version: ${chalk.cyan(dep)} @ ${chalk.redBright(
        rootVersion,
      )}`,
    );
    console.error();
  }
  console.error();

  console.error(`This is known to cause issues and is not supported by yoshi.`);
  console.error();

  console.error('📝 Suggestions:');
  console.error();

  console.error(' 1. Find the reason you have them by running:');
  for (const { dep } of conflicts) {
    console.error(`    ${chalk.grey('>')} npx qnm --why ${chalk.cyan(dep)}`);
  }
  console.error();

  console.error(
    " 2. Understand why it got there and allow for yoshi's version to be the only one.",
  );
  console.error(
    '    This could mean contacting a library author, or even simply re-creating your lock file.',
  );

  console.error();
  console.error("If you know what you're doing, you can force-skip this check");
  console.error(
    `by adding using the ${chalk.cyan(
      'SKIP_PREFLIGHT_CHECKS=true',
    )} environment variable.`,
  );

  console.error('\n');
}

function findDepConflicts(deps: Array<string>): Array<DepConflict> {
  return deps.flatMap(dep => {
    const local = resolveFrom(__dirname, dep);
    const root = resolveFrom(process.cwd(), dep);

    return local !== root
      ? [
          {
            dep,
            localVersion: readPkgUp.sync({ cwd: local })?.packageJson.version!,
            rootVersion: readPkgUp.sync({ cwd: root })?.packageJson.version!,
          },
        ]
      : [];
  });
}

export default function verifyDependencyTree() {
  const conflicts = findDepConflicts(['webpack']);

  if (!conflicts.length) {
    return;
  }

  logDepConflicts(conflicts);
  process.exit(1);
}
