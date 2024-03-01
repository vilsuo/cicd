import { Sequelize } from 'sequelize';
import * as logger from './logger';
import { POSTGRES_URL } from '../config';

export const sequelize = new Sequelize(POSTGRES_URL, {
  logging: false,
  pool: { max: 4 }, // ElephantSQL allows 5 connections
});

export const connectToDatabases = async (): Promise<null> => {
  try {
    await sequelize.authenticate();
    logger.info('Connected to the Postgres database');

  } catch (err) {
    logger.error('Error', err);
    logger.error('Failed to connect to the database');
    return process.exit(1);
  }

  return null;
};
