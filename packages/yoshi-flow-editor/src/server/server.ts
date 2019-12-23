import fs from 'fs';
import path from 'path';
// eslint-disable-next-line import/no-extraneous-dependencies
import httpTestkit from '@wix/wix-http-testkit';
import bodyParser from 'body-parser';
import cors from 'cors';
import velocityDataPrivate from './velocity.private.data.json';
import velocityData from './velocity.data.json';
import renderVM from './vm';

const serverDirectory = 'node_modules/yoshi-flow-editor/build/server';

const server = httpTestkit.server({
  port: process.env.PORT ? Number(process.env.PORT) : undefined,
  ssl: {
    cert: fs.readFileSync(
      path.join(serverDirectory, 'certificates/cert.pem'),
      'utf-8',
    ),
    key: fs.readFileSync(
      path.join(serverDirectory, 'certificates/key.pem'),
      'utf-8',
    ),
    // @ts-ignore
    passphrase: '1234',
  },
});

const app = server.getApp();

app.use(bodyParser.json());
app.use(cors());

app.get(
  '/_api/wix-laboratory-server/laboratory/conductAllInScope',
  (req, res) => {
    const experiments = {
      ...velocityData.experiments,
      ...velocityDataPrivate.experiments,
    };
    res.json(experiments);
  },
);

app.use('/editor/:widgetName', (req, res) => {
  const { widgetName } = req.params;
  res.send(renderVM('./src/templates/editorApp.vm', { widgetName }));
});

app.use('/settings/:widgetName', (req, res) => {
  const { widgetName } = req.params;
  res.send(renderVM('./src/templates/settingsPanel.vm', { widgetName }));
});

// Launch the server
server.start().then(
  () => {
    console.info(`Fake server is running on port ${server.getUrl()}`);
  },
  err => {
    console.error(
      `Fake server failed to start on port ${process.env.PORT}: ${err.message}`,
    );
  },
);
