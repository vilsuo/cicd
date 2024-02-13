const express = require('express');

// middleware
const requestLogger = require('../middleware/requestLogger');
const unknownEndpoint = require('../middleware/unknownEndpoint');
const errorHandler = require('../middleware/errorHandler');

// routers
const notesRouter = require('./notes');

const router = express();

router.use(express.json());
router.use(requestLogger);

router.get('/health', async (req, res) => {
  return res.send({ message: 'ok' });
});

router.use('/notes', notesRouter);

router.use(unknownEndpoint);
router.use(errorHandler);

module.exports = router;
