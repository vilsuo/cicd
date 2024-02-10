const path = require('path');
const express = require('express');
require('express-async-errors');
const router = require('./router');

const app = express();

app.use('/api', router);

const DIST = path.join(__dirname, '..', 'dist');

app.use(express.static(DIST));

app.use('*',  (req, res) => {
  res.sendFile(path.join(DIST, 'index.html'));
});

module.exports = app;
