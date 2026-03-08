const { RefreshToken } = require('../models');

class RefreshTokenRepository {
    async create (tokenData) {
        return await RefreshToken.create(tokenData);
    }

    async findByToken(token) {   
        return await RefreshToken.findOne({ where: { token } });
    }

    async deleteByToken (token) {
        return await RefreshToken.destroy({ where: { token } });
    }


};

module.exports = new RefreshTokenRepository();