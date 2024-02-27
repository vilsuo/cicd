import express, { RequestHandler } from 'express';
import { sequelize } from '../util/db';
import * as logger from '../util/logger';

// middleware
import requestLogger from '../middleware/requestLogger';
import unknownEndpoint from '../middleware/unknownEndpoint';
import errorHandler from '../middleware/errorHandler';

// routers
import notesRouter from './notes';
import testingRouter from './testing';
import { Comment } from '../model';
import { NoteDto } from '../types';

// modify express request object
declare module 'express-serve-static-core' {
  interface Request {
    note?: NoteDto;
  }
}

const router = express();

router.use(express.json());
router.use(requestLogger);

router.get('/health', (async (_req, res) => {
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
}) as RequestHandler);

router.use('/notes', notesRouter);

if (process.env.NODE_ENV === 'test') {
  router.use('/testing', testingRouter);
}

router.use(unknownEndpoint);
router.use(errorHandler);

export default router;
