// `${DB_DIALECT}://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;

const POSTGRES_URL_TEST = 'postgres://postgres:secret@localhost:5434/cicd_test';
const POSTGRES_URL_DEV = 'postgres://postgres:secret@localhost:5433/cicd_dev';

const POSTGRES_URLS = {
  test: process.env.POSTGRES_URL_TEST || POSTGRES_URL_TEST,
  development: POSTGRES_URL_DEV,
  production: process.env.POSTGRES_URL,
};

const NODE_ENV = process.env.NODE_ENV;
if (NODE_ENV !== 'test' && NODE_ENV !== 'development' && NODE_ENV !== 'production') {
  throw new Error('Invalid environment');
}

export const POSTGRES_URL: string = POSTGRES_URLS[NODE_ENV];

export const PORT = process.env.PORT || 3000;
