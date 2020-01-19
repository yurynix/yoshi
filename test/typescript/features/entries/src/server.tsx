import ejs from 'ejs';
import express from 'express';

const app = express();

app.get('/other', async (req, res) => {
  res.send(await ejs.renderFile('./src/other.ejs'));
});

app.listen(process.env.PORT);
