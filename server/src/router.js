const express = require('express');

const requestLogger = require('./middleware/requestLogger');
const unknownEndpoint = require('./middleware/unknownEndpoint');
const errorHandler = require('./middleware/errorHandler');

const router = express();

router.use(express.json());
router.use(requestLogger);

router.get('/health', async (req, res) => {
  //throw Error('custom error');
  return res.send({ message: 'ok' });
});

router.use(unknownEndpoint);
router.use(errorHandler);

module.exports = router;