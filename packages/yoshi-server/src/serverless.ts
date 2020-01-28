import path from 'path';
import globby from 'globby';
import importFresh from 'import-fresh';
import Youch from 'youch';
import { Router, RequestHandler, Request, Response } from 'express';
import { ROUTES_BUILD_DIR } from 'yoshi-config/paths';
import { RouteFunction } from './types';
import { relativeFilePath, pathMatch } from './utils';

const { FullHttpResponse, HttpError } = require('@wix/serverless-api');

export type Route = {
  route: string;
  handler: (
    req: Request,
    res: Response,
    params: { [param: string]: any },
  ) => void;
};

const routesBuildDir = path.resolve(ROUTES_BUILD_DIR);

const serverChunks = globby.sync('**/*.js', {
  cwd: routesBuildDir,
  absolute: true,
});

const handlers: Array<Route> = serverChunks.map(absolutePath => {
  const chunk = importFresh(absolutePath) as RouteFunction<any>;
  const relativePath = `/${relativeFilePath(routesBuildDir, absolutePath)}`;
  const routePath = relativePath.replace(/\[(\w+)\]/g, ':$1');

  return {
    route: routePath,
    handler: async (req, context, params) => {
      const fnThis = {
        context,
        req: req,
        params,
      };

      console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
      console.log(chunk.toString());
      console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
      try {
        return new FullHttpResponse({
          status: 200,
          body: await chunk.call(fnThis),
        });
      } catch (error) {
        if (process.env.NODE_ENV === 'production') {
          throw new HttpError({ status: 500, message: 'Coupon not found' });
        }

        const youch = new Youch(error, req);
        const html: string = await youch.toHTML();

        throw new HttpError({ status: 500, message: html });
      }
    },
  };
});

export default (functionsBuilder: any) => {
  return handlers.reduce((builder, handler) => {
    console.log(
      handler.route,
      handler.route.includes('_api_') ? 'POST' : 'GET',
    );
    return builder.addWebFunction(
      handler.route.includes('_api_') ? 'POST' : 'GET',
      handler.route,
      async (ctx: any, req: any) => {
        return handler.handler(req, ctx, req.params);
      },
    );
  }, functionsBuilder);
};

// bootstrap()
//   // https://github.com/wix-platform/wix-node-platform/tree/master/greynode/wix-bootstrap-greynode
//   .use(require('@wix/wix-bootstrap-greynode'))
//   // https://github.com/wix-platform/wix-node-platform/tree/master/bootstrap-plugins/hadron/wix-bootstrap-hadron
//   .use(require('@wix/wix-bootstrap-hadron'))
//   // https://github.com/wix-platform/wix-node-platform/tree/master/bootstrap/wix-bootstrap-require-login
//   .use(require('@wix/wix-bootstrap-require-login'))
//   .express(async (app: Router, context: any) => {
//     const server = new Server(context);

//     app.all('*', server.handle);

//     return app;
//   })
//   .start();
