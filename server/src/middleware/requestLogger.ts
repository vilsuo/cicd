import { NextFunction, Request, Response } from 'express';
import * as logger from '../util/logger';

const requestLogger = (req: Request, _res: Response, next: NextFunction) => {
  logger.info('Method:', req.method);
  logger.info('Path:  ', req.path);
  logger.info('Query: ', req.query);
  logger.info('Body:  ', req.body);
  logger.info('---');
  
  return next();
};

export default requestLogger;
