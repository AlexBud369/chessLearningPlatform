const sequelize = require('../config/database');
const User = require('./User')(sequelize);
const RefreshToken = require('./RefreshToken')(sequelize);
const Theme = require('./Theme')(sequelize);
const Course = require('./Course')(sequelize);
const Lesson = require('./Lesson')(sequelize);
const Task = require('./Task')(sequelize);
const CourseTask = require('./CourseTask')(sequelize);
const UserProgress = require('./UserProgress')(sequelize);
const Game = require('./Game')(sequelize);
const AnalysisNode = require('./AnalysisNode')(sequelize);
const TrainerStudent = require('./TrainerStudent')(sequelize);
const Favorite = require('./Favorite')(sequelize);

const models = {
  User,
  RefreshToken,
  Theme,
  Course,
  Lesson,
  Task,
  CourseTask,
  UserProgress,
  Game,
  AnalysisNode,
  TrainerStudent,
  Favorite,
};

const defineAssociations = require('./associations');
defineAssociations(models);

module.exports = {
  sequelize,
  ...models,
};