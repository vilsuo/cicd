const logger = require('../util/logger');

const requestLogger = (req, res, next) => {
  logger.info('Method:', req.method);
  logger.info('Path:  ', req.path);
  logger.info('Query: ', req.query);
  logger.info('Body:  ', req.body);
  logger.info('---');
  
  return next();
};

module.exports = requestLogger;
