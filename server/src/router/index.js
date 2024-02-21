const express = require('express');
const { sequelize } = require('../util/db');
const logger = require('../util/logger');

// middleware
const requestLogger = require('../middleware/requestLogger');
const unknownEndpoint = require('../middleware/unknownEndpoint');
const errorHandler = require('../middleware/errorHandler');

// routers
const notesRouter = require('./notes');
const testingRouter = require('./testing');
const { Comment } = require('../model');

const router = express();

router.use(express.json());
router.use(requestLogger);

router.get('/health', async (req, res) => {
  try {
    await sequelize.authenticate();

    await Comment.findOne();
    
  } catch (error) {
    logger.error(error);

    // Render health check fails with status code outside 200-399
    // 503: Service Unavailable - The server is not ready to handle the request.
    return res.status(503).send({
      message: 'Unable to connect to the database'
    });
  }
  return res.send({ message: 'ok' });
});

router.use('/notes', notesRouter);

if (process.env.NODE_ENV === 'test') {
  router.use('/testing', testingRouter);
}

router.use(unknownEndpoint);
router.use(errorHandler);

module.exports = router;
