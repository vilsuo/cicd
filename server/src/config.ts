// `${DB_DIALECT}://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;

const POSTGRES_URL_TEST = 'postgres://postgres:secret@localhost:5434/cicd_test';
const POSTGRES_URL_DEV = 'postgres://postgres:secret@localhost:5433/cicd_dev';

type Glob = string | [string, { cwd?: string, ignore?: string | string[] }];

export const getMigrationsGlob = (env: string | undefined): Glob => {
  if (env === 'production') {
    return ['migrations/*.js', { cwd: 'build' }];
  }

  return 'migrations/*.ts';
};

const getPostgresUrl = (env: string | undefined): string => {
  switch (env) {
    case 'test': {
      return process.env.POSTGRES_URL_TEST || POSTGRES_URL_TEST;
    }
    case 'development': {
      return POSTGRES_URL_DEV;
    }
    case 'production': {
      if (process.env.POSTGRES_URL === undefined) {
        throw new Error('Production database url is missing');
      }
      return process.env.POSTGRES_URL;
    }
    default:
      throw new Error('Invalid NODE_ENV');
  }
};

export const POSTGRES_URL = getPostgresUrl(process.env.NODE_ENV);

export const PORT = process.env.PORT || 3000;
