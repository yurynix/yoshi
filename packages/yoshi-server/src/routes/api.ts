import path from 'path';
import globby from 'globby';
import { Request, Response } from 'express';
// eslint-disable-next-line import/no-extraneous-dependencies
import { NextHandleFunction } from 'connect';
import importFresh from 'import-fresh';
import { send, json as parseBodyAsJson } from 'micro';
import { PathReporter } from 'io-ts/lib/PathReporter';
import { isLeft } from 'fp-ts/lib/Either';
import serializeError from 'serialize-error';
import { BUILD_DIR } from 'yoshi-config/build/paths';
import { requestPayloadCodec, DSL } from '../types';
import { relativeFilePath } from '../utils';
import { route } from '..';

const buildDir = path.resolve(BUILD_DIR);

const serverChunks = globby.sync('**/*.api.js', {
  cwd: buildDir,
  absolute: true,
});

const functions: {
  [filename: string]: {
    [functionName: string]: DSL<any, any> | Array<NextHandleFunction>;
  };
} = serverChunks.reduce((acc, absolutePath) => {
  const chunk = importFresh(absolutePath);
  const filename = relativeFilePath(buildDir, absolutePath);

  return {
    ...acc,
    [filename]: chunk,
  };
}, {});

async function applyMiddlewares(
  middleware: Array<NextHandleFunction>,
  req: Request,
  res: Response,
) {
  await middleware.reduce(async (acc, middleware): Promise<void> => {
    await acc;
    return new Promise((resolve, reject) => {
      middleware(req, res, (error: any) => (error ? reject(error) : resolve()));
    });
  }, Promise.resolve());
}

export default route(async function() {
  const body = await parseBodyAsJson(this.req);
  const validation = requestPayloadCodec.decode(body);

  if (isLeft(validation)) {
    return send(this.res, 406, {
      errors: PathReporter.report(validation),
    });
  }

  const { fileName, functionName, args } = validation.right;
  const fn = (functions?.[fileName]?.[functionName] as DSL<any, any>)?.__fn__;

  if (!fn) {
    return send(this.res, 406, {
      errors: `Function ${functionName}() was not found in file ${fileName}`,
    });
  }

  try {
    const fnThis = {
      context: this.context,
      req: this.req,
      res: this.res,
    };

    const middlewares = functions?.[fileName]?.middlewares as
      | Array<NextHandleFunction>
      | undefined;
    if (middlewares) {
      await applyMiddlewares(middlewares, this.req, this.res);
    }
    return { payload: await fn.apply(fnThis, args) };
  } catch (error) {
    if (process.env.NODE_ENV === 'production') {
      return send(this.res, 500, {
        errors: ['internal server error'],
      });
    }

    return send(this.res, 500, {
      errors: [serializeError(error)],
    });
  }
});
