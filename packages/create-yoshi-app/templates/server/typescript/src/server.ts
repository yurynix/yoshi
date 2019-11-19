import { Router } from 'express';
import wixExpressCsrf from '@wix/wix-express-csrf';
import wixExpressRequireHttps from '@wix/wix-express-require-https';
import { AppContext } from './types';

export = (app: Router, context: AppContext) => {
  app.use(wixExpressCsrf());
  app.use(wixExpressRequireHttps);

  app.get('/', (req, res) => {
    res.json({
      success: true,
      payload: 'Hello world!',
      petriScopes: context.petriScopes,
    });
  });

  return app;
};
