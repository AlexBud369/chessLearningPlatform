require('dotenv').config();
const { sequelize } = require('../src/models');
const { runSchemaMigrations } = require('../src/db/runSchemaMigrations');
const { seedDefaultThemes } = require('../src/db/seedDefaultThemes');

const seed = async () => {
  try {
    await sequelize.authenticate();
    console.log('Подключение к БД установлено');
    await runSchemaMigrations(sequelize);
    await seedDefaultThemes();
    console.log('Тематики для курсов добавлены');
    process.exit(0);
  } catch (error) {
    console.error('Ошибка:', error);
    process.exit(1);
  }
};

seed();
