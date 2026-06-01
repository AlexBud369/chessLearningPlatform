const { DataTypes } = require('sequelize');
const { TASK } = require('../constants');

module.exports = (sequelize) => {
  const Task = sequelize.define(
    'Task',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING(TASK.TITLE_MAX_LENGTH),
        allowNull: true,
      },
      fen: {
        type: DataTypes.STRING(TASK.FEN_MAX_LENGTH),
        allowNull: false,
      },
      solution: {
        type: DataTypes.STRING(TASK.SOLUTION_MAX_LENGTH),
        allowNull: false,
      },
      difficulty: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
        validate: {
          min: TASK.DIFFICULTY_MIN,
          max: TASK.DIFFICULTY_MAX,
        },
      },
      theme_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'themes',
          key: 'id',
        },
        onDelete: 'RESTRICT',
      },
      author_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'tasks',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return Task;
};