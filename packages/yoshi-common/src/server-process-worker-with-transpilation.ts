import { setupRequireHooks } from './require-hooks';

// We use this file in order to have a `fork` with `ipc`
// We setup either `babel/register` or `ts-node`
// for the user's server file to have transpilation enabled
const userServerFilePath = process.env.__SERVER_FILE_PATH__ as string;

setupRequireHooks();

require(userServerFilePath);
