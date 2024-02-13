require('dotenv').config();

module.exports = {
  POSTGRES_URL: (process.env.NODE_ENV !== 'test')
    ? process.env.POSTGRES_URL
    : process.env.POSTGRES_URL_TEST,
  PORT: process.env.PORT || 3000,
};
