require('dotenv').config();
const { sequelize } = require('../src/models');
const { runSchemaMigrations } = require('../src/db/runSchemaMigrations');

const run = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected');

    await runSchemaMigrations(sequelize);
    console.log('Schema migrations completed');

    await sequelize.sync({ alter: true });
    console.log('Models synchronized');
  } catch (error) {
    console.error('Migration failed:', error.message);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
};

run();
