import { Server } from 'yoshi-server';

const bootstrap = require('@wix/wix-bootstrap-ng');

bootstrap()
  .express(async (app, context) => {
    const server = await Server.create(context);
    app.use(() => {
      throw new Error('Error');
    });
    app.all('*', server.handle);

    return app;
  })
  .start({
    disableCluster: true,
  });
