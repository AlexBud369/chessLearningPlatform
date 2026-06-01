const { RefreshToken } = require('../models');

class RefreshTokenRepository {
  async create(data) {
    return RefreshToken.create(data);
  }

  async findByToken(token) {
    return RefreshToken.findOne({ where: { token } });
  }

  async deleteByToken(token) {
    return RefreshToken.destroy({ where: { token } });
  }

  async deleteAllForUser(userId) {
    return RefreshToken.destroy({ where: { user_id: userId } });
  }

  async getLastLoginAt(userId) {
    return RefreshToken.max('updated_at', { where: { user_id: userId } });
  }
}

module.exports = new RefreshTokenRepository();
