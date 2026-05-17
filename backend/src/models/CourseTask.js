const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const CourseTask = sequelize.define(
    'CourseTask',
    {
      course_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'courses',
          key: 'id',
        },
        onDelete: 'CASCADE',
        primaryKey: true,
      },
      task_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'tasks',
          key: 'id',
        },
        onDelete: 'CASCADE',
        primaryKey: true,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'course_tasks',
      timestamps: false, 
      createdAt: 'created_at',
      updatedAt: false,
    }
  );

  return CourseTask;
};