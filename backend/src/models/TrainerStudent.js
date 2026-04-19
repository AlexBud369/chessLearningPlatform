const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const TrainerStudent = sequelize.define(
    'TrainerStudent',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      trainer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      student_id: {
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
    },
    {
      tableName: 'trainer_students',
      timestamps: false,
      createdAt: 'created_at',
      updatedAt: false,
    }
  );

  return TrainerStudent;
};