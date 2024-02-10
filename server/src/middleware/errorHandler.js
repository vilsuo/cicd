const logger = require('../util/logger');

// eslint-disable-next-line no-unused-vars
const errorHandler = (error, req, res, _next) => {
  logger.error('Error', error.message);
  
  return res.status(500).send({ message: error.message });
};

module.exports = errorHandler;
