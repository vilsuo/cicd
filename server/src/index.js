const path = require('path');
const express = require('express');
const router = require('./router');
const requestLogger = require('./middleware/requestLogger');
const app = express();

app.use(express.json());
app.use(requestLogger);

app.use('/api', router);

const DIST = path.join(__dirname, '..', 'dist');

app.use(express.static(DIST));

app.use('*',  (req, res) => {
  res.sendFile(path.join(DIST, 'index.html'));
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});