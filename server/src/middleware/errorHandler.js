const logger = require('../util/logger');

const errorHandler = (error, req, res, next) => {
  logger.error('Error', error.message);
  
  return res.status(500).send({ message: error.message });
};

module.exports = errorHandler;