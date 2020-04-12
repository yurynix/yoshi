const fs = require('fs');
const runPreflightChecks = require('yoshi-common/build/preflight-checks')
  .default;

const presetPath = require.resolve('../src/index.js');

// load can validate the config
require('yoshi-config');

module.exports = async command => {
  const appDirectory = fs.realpathSync(process.cwd());
  const action = require(`./commands/${command}`);

  await runPreflightChecks();

  const { persistent = false } = await action({
    context: presetPath,
    workerOptions: { cwd: appDirectory },
  });

  if (!persistent) {
    process.exit(0);
  }
};
