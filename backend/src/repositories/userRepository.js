const { User } = require('../models');
const { Op } = require('sequelize');

class UserRepository {
  async create(userData) {
    return await User.create(userData);
  }

  async findById(id) {
    return await User.findByPk(id);
  }

  async findByEmail(email) {
    return await User.findOne({ where: { email } });
  }

  async update(id, updateData) {
    const [, rows] = await User.update(updateData, { where: { id }, returning: true });
    return rows[0] || null;
  }

  async findAllPaginated({ limit, offset }) {
    return await User.findAndCountAll({
      attributes: ['id', 'first_name', 'last_name', 'email', 'role', 'is_blocked', 'created_at'],
      limit,
      offset,
      order: [['created_at', 'DESC']],
    });
  }

  async searchPlayers(query, limit = 10) {
    const trimmed = query.trim();
    if (!trimmed) return [];

    return await User.findAll({
      where: {
        role: 'player',
        is_blocked: false,
        [Op.or]: [
          { email: { [Op.iLike]: `%${trimmed}%` } },
          { first_name: { [Op.iLike]: `%${trimmed}%` } },
          { last_name: { [Op.iLike]: `%${trimmed}%` } },
        ],
      },
      attributes: ['id', 'first_name', 'last_name', 'email'],
      limit,
      order: [['last_name', 'ASC']],
    });
  }
}

module.exports = new UserRepository();
