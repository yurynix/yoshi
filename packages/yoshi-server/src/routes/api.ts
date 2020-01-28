import path from 'path';
import globby from 'globby';
import importFresh from 'import-fresh';
import { send, json as parseBodyAsJson } from 'micro';
import { PathReporter } from 'io-ts/lib/PathReporter';
import { isLeft } from 'fp-ts/lib/Either';
import serializeError from 'serialize-error';
import { BUILD_DIR } from 'yoshi-config/paths';
import { requestPayloadCodec, DSL } from '../types';
import { relativeFilePath } from '../utils';
import { route } from '..';

const buildDir = path.resolve(BUILD_DIR);

const serverChunks = globby.sync('**/*.api.js', {
  cwd: buildDir,
  absolute: true,
});

const functions: {
  [filename: string]:
    | { [functionName: string]: DSL<any, any> | undefined }
    | undefined;
} = serverChunks.reduce((acc, absolutePath) => {
  const chunk = importFresh(absolutePath);
  const filename = relativeFilePath(buildDir, absolutePath);

  return {
    ...acc,
    [filename]: chunk,
  };
}, {});

// console.log('-------------------1');
// console.log(functions['api/greeting.api']?.greet?.__fn__.toString());
// console.log('-------------------');
export default route(async function() {
  const validation = requestPayloadCodec.decode(this.req.body);

  if (isLeft(validation)) {
    throw new Error('validation error');
  }

  const { fileName, functionName, args } = validation.right;
  const fn = functions?.[fileName]?.[functionName]?.__fn__;

  if (!fn) {
    throw new Error('222');
  }

  try {
    const fnThis = {
      context: this.context,
      req: this.req,
    };

    return await fn.apply(fnThis, args);
  } catch (error) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('internal server error');
      // return send(this.res, 500, {
      //   errors: ['internal server error'],
      // });
    }

    throw new Error('internal server error');
    // return send(this.res, 500, {
    //   errors: [serializeError(error)],
    // });
  }
});
