const { DataTypes } = require('sequelize');
const { LESSON } = require('../constants');

module.exports = (sequelize) => {
  const Lesson = sequelize.define(
    'Lesson',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      course_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'courses',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      title: {
        type: DataTypes.STRING(LESSON.TITLE_MAX_LENGTH),
        allowNull: false,
      },
      content_type: {
        type: DataTypes.ENUM('video', 'text'),
        allowNull: false,
        defaultValue: 'text',
      },
      content: {
        type: DataTypes.TEXT, // может быть URL видео или HTML/Markdown
        allowNull: false,
      },
      order_index: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
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
      tableName: 'lessons',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return Lesson;
};