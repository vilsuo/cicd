const express = require('express');

const requestLogger = require('./middleware/requestLogger');
const unknownEndpoint = require('./middleware/unknownEndpoint');
const errorHandler = require('./middleware/errorHandler');

const router = express();

router.use(express.json());
router.use(requestLogger);

router.get('/ping', async (req, res) => {
  return res.send('pong');
});

router.use(unknownEndpoint);
router.use(errorHandler);

module.exports = router;