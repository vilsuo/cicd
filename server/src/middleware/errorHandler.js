const { Sequelize } = require('sequelize');
const logger = require('../util/logger');

const createMessageFromErrorArray = (errors) => {
  return errors.map((err) => err.message).join('. ');
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (error, req, res, next) => {
  logger.info('Error', error.message);
  
  switch(true) {
    // https://github.com/sequelize/sequelize/blob/3e5b8772ef75169685fc96024366bca9958fee63/lib/errors.js
    case error instanceof Sequelize.ValidationError: {
      return res.status(400).send({
        message: createMessageFromErrorArray(error.errors),
      });
    }

    default: {
      logger.error('Unhandled error type', error);
      return res.status(500).send({ message: error.message });
    }
  }
};

module.exports = errorHandler;
