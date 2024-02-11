const { sequelize, connectToDatabases } = require('../src/util/db');

beforeAll(async () => {
  await connectToDatabases();
});

afterAll(async () => {
  await sequelize.close();
});
