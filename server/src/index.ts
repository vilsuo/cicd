import app from './app';
import { PORT } from './config';
import { connectToDatabases } from './util/db';
import * as logger from './util/logger';

const start = async () => {
  await connectToDatabases();

  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
};

start().then(
  () => {},
  (err) => { throw err; }
);
