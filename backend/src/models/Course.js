const { DataTypes } = require('sequelize');
const { COURSE } = require('../constants');

module.exports = (sequelize) => {
  const Course = sequelize.define(
    'Course',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING(COURSE.TITLE_MAX_LENGTH),
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING(COURSE.DESCRIPTION_MAX_LENGTH),
        allowNull: true,
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
      tableName: 'courses',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return Course;
};