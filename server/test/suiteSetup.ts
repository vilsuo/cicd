/*
this script file presents you the opportunity of running some code immediately
after the test framework has been installed in the environment but before the
test code itself.

meant for code which is repeating in each test file. Having the test framework
installed makes Jest globals, jest object and expect accessible in the modules. 
*/

import { sequelize, connectToDatabases } from '../src/util/db';

beforeAll(async () => {
  await connectToDatabases();

  // Create all tables, dropping them first if they already exist.
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  // Drop all tables
  await sequelize.drop();

  await sequelize.close();
});
