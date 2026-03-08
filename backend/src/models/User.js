const { DataTypes } = require('sequelize');
const { USER } = require('../constants');

module.exports = (sequelize) => {
    const User = sequelize.define(
    'User', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        first_name: {
            type: DataTypes.STRING(USER.NAME_MAX_LENGTH),
            allowNull: false
        },
        last_name: {
            type: DataTypes.STRING(USER.NAME_MAX_LENGTH),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(USER.EMAIL_MAX_LENGTH),
            allowNull: false,
            unique: true,
            validate: { isEmail: true }
        },
        password_hash: {
            type: DataTypes.STRING(USER.PASSWORD_HASH_LENGTH),
            allowNull: false
        },
        role: {
            type: DataTypes.ENUM('player', 'trainer', 'admin'),
            defaultValue: 'player'
        },
        avatar: {
            type: DataTypes.STRING(USER.AVATAR_MAX_LENGTH),
            allowNull: true
        },
        is_blocked: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        updated_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }

    }, {
        tableName: 'users',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });

    return User;
}
