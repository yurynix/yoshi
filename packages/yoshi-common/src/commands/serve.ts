import path from 'path';
import fs from 'fs';
import loadConfig from 'yoshi-config/loadConfig';
import { getServerStartFile } from 'yoshi-helpers/build/server-start-file';
import { serverStartFileParser } from 'yoshi-helpers/build/server-start-file-parser';
import { STATICS_DIR } from 'yoshi-config/build/paths';
import { ServerProcess } from '../server-process';
import { startCDN } from '../cdn';

const serve = async function() {
  process.env.NODE_ENV = 'production';
  process.env.BABEL_ENV = 'production';

  return new Promise<() => Promise<void>>(async (resolve, reject) => {
    const config = loadConfig();

    if (config.experimentalMonorepo) {
      reject(`Error: yoshi-flow-monorepo is not supported yet`);
      return;
    }

    const packageJSON = require(path.resolve(process.cwd(), 'package.json'));
    const serverFilePath =
      serverStartFileParser(packageJSON) ?? getServerStartFile();

    if (
      !fs.existsSync(STATICS_DIR) ||
      fs.readdirSync(STATICS_DIR).length === 0
    ) {
      reject(
        `Error: ${STATICS_DIR} directory is empty. Run yoshi build before running the serve command`,
      );
      return;
    }

    const serverProcess = new ServerProcess({
      serverFilePath,
      appName: config.name,
      env: {
        NODE_ENV: 'development',
      },
    });

    const [, cdn] = await Promise.all([
      serverProcess.initialize(),
      startCDN(config),
    ]);

    resolve(() => Promise.all([serverProcess.close(), cdn.close()]).then());
  });
};

export default serve;
