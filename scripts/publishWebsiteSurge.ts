import path from 'path';
import chalk from 'chalk';
import execa from 'execa';

const WEBSITE_FOLDER = path.join(__dirname, '..', 'website');
const WEBSITE_BUILD_FOLDER = path.join(WEBSITE_FOLDER, 'build');

const newLine = () => process.stdout.write('\n');
(async () => {
  try {
    console.log(chalk.inverse.white('Installing and building docs website...'));
    newLine();
    await execa('yarn', ['install'], { cwd: WEBSITE_FOLDER, stdio: 'inherit' });
    await execa('yarn', ['build'], { cwd: WEBSITE_FOLDER, stdio: 'inherit' });
    console.log(chalk.inverse.white('Releasing website to surge...'));
    newLine();
    await execa(
      'teamcity-surge-autorelease',
      [`--dist=${WEBSITE_BUILD_FOLDER}`],
      { stdio: 'inherit' },
    );
    newLine();
    console.log(chalk.inverse.white('DONE!'));
  } catch (e) {
    newLine();
    console.error(chalk.inverse.red('Unable to publish website to surge!'));
    console.error(e.stack);
    process.exitCode = 1;
  }
})();
