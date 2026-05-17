const { DataTypes } = require('sequelize');
const { THEME } = require('../constants');

module.exports = (sequelize) => {
  const Theme = sequelize.define(
    'Theme',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(THEME.NAME_MAX_LENGTH),
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.STRING(THEME.DESCRIPTION_MAX_LENGTH),
        allowNull: true,
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
      tableName: 'themes',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return Theme;
};