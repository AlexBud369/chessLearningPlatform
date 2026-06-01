require('dotenv').config();
const { sequelize, Course } = require('../src/models');

const DEFAULT_COVER = '/images/background/channels4_profile.jpg';

const run = async () => {
  try {
    await sequelize.authenticate();
    const [updated] = await Course.update({ cover_image: DEFAULT_COVER }, { where: {} });
    console.log(`Обложка назначена ${updated} курсам: ${DEFAULT_COVER}`);
    process.exit(0);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
};

run();
