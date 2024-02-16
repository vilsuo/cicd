const express = require('express');

// middleware
const requestLogger = require('../middleware/requestLogger');
const unknownEndpoint = require('../middleware/unknownEndpoint');
const errorHandler = require('../middleware/errorHandler');

// routers
const notesRouter = require('./notes');
const testingRouter = require('./testing');

const router = express();

router.use(express.json());
router.use(requestLogger);

router.get('/health', async (req, res) => {
  return res.send({ message: 'ok' });
});

router.use('/notes', notesRouter);

if (process.env.NODE_ENV === 'test') {
  router.use('/testing', testingRouter);
}

router.use(unknownEndpoint);
router.use(errorHandler);

module.exports = router;
