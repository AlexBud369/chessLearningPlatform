module.exports = (models) => {
    const {User, RefreshToken } = models;

    User.hasMany(RefreshToken, {
        foreignKey: 'user_id',
        as: 'refreshTokens',
        onDelete: 'CASCADE',
    });

    RefreshToken.belongsTo(User, {
        foreignKey: 'user_id',
        as: 'user',
    });
};