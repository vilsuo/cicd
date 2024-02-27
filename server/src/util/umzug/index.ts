import { Umzug, SequelizeStorage, UmzugCLI, CommandLineParserOptions } from 'umzug';
import { sequelize, connectToDatabases } from '../db';

// to show more of the thrown Errors https://github.com/sequelize/umzug#CLI
class MyUmzugCLI extends UmzugCLI {
  async execute() {
    await super.executeWithoutErrorHandling();
    return true;
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
class MyUmzug extends Umzug {
  getCLI(options: CommandLineParserOptions) {
    return new MyUmzugCLI(this, options);
  }
}

const migrationConf = {
  migrations: { glob: 'migrations/*.js' },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize, tableName: 'migrations' }),
  logger: console,
};

const umzug = new /*My*/Umzug(migrationConf);

export default umzug;

if (require.main === module) {
  // this module was run directly from the command line as in node xxx.js
  const runAsCLI = async () => {
    await connectToDatabases();
    await umzug.runAsCLI();
  };

  // The void operator evaluates the given expression and then returns undefined. see:
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/void
  // https://github.com/typescript-eslint/typescript-eslint/blob/HEAD/packages/eslint-plugin/docs/rules/no-floating-promises.md#ignorevoid
  void runAsCLI();
}
