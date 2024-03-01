import path from 'path';
import express from 'express';
require('express-async-errors');
import router from './router';

const app = express();

app.use('/api', router);

const DIST = path.join(__dirname, '..', 'build', 'dist');

app.use(express.static(DIST));

app.use('*',  (_req, res) => {
  res.sendFile(path.join(DIST, 'index.html'));
});

export default app;
