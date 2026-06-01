require('dotenv').config();
const bcrypt = require('bcrypt');
const { sequelize, User, RefreshToken, TrainerStudent, UserProgress, Favorite, CourseTask, Game, AnalysisNode } = require('../src/models');
const { runSchemaMigrations } = require('../src/db/runSchemaMigrations');

const clearDatabase = async () => {
  await RefreshToken.destroy({ where: {}, truncate: { cascade: true } });
  await TrainerStudent.destroy({ where: {}, truncate: { cascade: true } });
  await UserProgress.destroy({ where: {}, truncate: { cascade: true } });
  await Favorite.destroy({ where: {}, truncate: { cascade: true } });
  await CourseTask.destroy({ where: {}, truncate: { cascade: true } });
  await Game.destroy({ where: {}, truncate: { cascade: true } });
  await AnalysisNode.destroy({ where: {}, truncate: { cascade: true } });
  await User.destroy({ where: {}, truncate: { cascade: true } });
  console.log('Все данные очищены');
};

const createUsers = async () => {
  const hashedPassword = await bcrypt.hash('password123', 10);
  const users = [
    { first_name: 'Игрок', last_name: 'Тестовый', email: 'player@test.com', password_hash: hashedPassword, role: 'player', is_blocked: false },
    { first_name: 'Тренер', last_name: 'Тестовый', email: 'trainer@test.com', password_hash: hashedPassword, role: 'trainer', is_blocked: false },
    { first_name: 'Админ', last_name: 'Тестовый', email: 'admin@test.com', password_hash: hashedPassword, role: 'admin', is_blocked: false },
  ];

  for (const userData of users) {
    const [user, created] = await User.findOrCreate({
      where: { email: userData.email },
      defaults: userData,
    });
    if (created) {
      console.log(`Создан пользователь: ${user.email} (${user.role})`);
    } else {
      console.log(`Пользователь ${user.email} уже существует, пропускаем`);
    }
  }
};

const seed = async () => {
  try {
    await sequelize.authenticate();
    console.log('Подключение к БД установлено');
    await runSchemaMigrations(sequelize);
    await sequelize.sync({ alter: true });
    console.log('Синхронизация моделей завершена');
    await clearDatabase();
    await createUsers();
    console.log('Скрипт сидирования выполнен успешно');
    process.exit(0);
  } catch (error) {
    console.error('Ошибка:', error);
    process.exit(1);
  }
};

seed();