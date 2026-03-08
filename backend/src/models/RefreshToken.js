const { DataTypes } = require('sequelize');


module.exports = (sequelize) => {
    const RefreshToken = sequelize.define('RefreshToken',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            token: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            expires_at: {
                type: DataTypes.DATE,
                allowNull: false
            }
        },
        {
            tableName: 'refresh_tokens',
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at'
        }
    )
    return RefreshToken;
};
