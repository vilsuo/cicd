import { ValidationError } from 'sequelize';
import * as logger from '../util/logger';
import { ParseError } from '../util/error';
import { ErrorRequestHandler } from 'express';

const createMessageFromErrorArray = (errors: Array<{ message: string }>) => {
  return errors.map((err) => err.message).join('. ');
};

// eslint-disable-next-line no-unused-vars
const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  logger.info('Error', error.message);
  
  switch(true) {
    // https://github.com/sequelize/sequelize/blob/3e5b8772ef75169685fc96024366bca9958fee63/lib/errors.js
    case error instanceof ValidationError: {
      return res.status(400).send({
        message: createMessageFromErrorArray(error.errors),
      });
    }
    
    case error instanceof ParseError: {
      return res.status(400).send({
        message: error.message,
      });
    }

    default: {
      logger.error('Unhandled error type', error);
      return res.status(500).send({ message: error.message });
    }
  }
};

export default errorHandler;
