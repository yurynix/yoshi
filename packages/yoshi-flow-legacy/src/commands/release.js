const wnpm = require('wnpm-ci');
const { createRunner } = require('haste-core');
const LoggerPlugin = require('../plugins/haste-plugin-yoshi-logger');
const parseArgs = require('minimist');
const boxen = require('boxen');

const cliArgs = parseArgs(process.argv.slice(2));

const shouldBumpMinor = cliArgs.minor;

const runner = createRunner({
  logger: new LoggerPlugin(),
});

module.exports = runner.command(async () => {
  console.warn(
    boxen(
      `
The command \`yoshi release\` is DEPRECATED
and will be removed in the next major version (yoshi@5)

In order to continue and bump the minor/patch version in the CI,
please add this to the \`publishConfig\` in \`package.json\`
and remove the \`release\` script

...
  "publishConfig": {
    "registry": "http://npm.dev.wixpress.com/",
    "versionBumpStrategy": "minor"
  },
...

Note that this is a CI feature, for more information see:

https://github.com/wix-private/wix-fed-scripts/pull/37
  `,
      { padding: 1 },
    ),
  );
  await wnpm.prepareForRelease({ shouldBumpMinor });
});
