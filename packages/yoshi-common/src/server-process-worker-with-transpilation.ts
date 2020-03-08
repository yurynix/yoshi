import { isTypescriptProject } from './utils/heuristics';

// We use this file in order to have a `fork` with `ipc`
// We setup `ts-node` for the user's server file to have transpilation enabled
const userServerFilePath = process.env.__SERVER_FILE_PATH__ as string;

if (isTypescriptProject()) {
  require('./require-hooks/ts-node-register');
}

require(userServerFilePath);
