const { Game } = require('../models');

class GameRepository {
  async create(gameData) {
    return await Game.create(gameData);
  }

  async findById(id) {
    return await Game.findByPk(id, {
      include: [{ association: 'user', attributes: ['id', 'first_name', 'last_name', 'email', 'role'] }],
    });
  }

  async findAllByUserId(userId, { limit = 10, offset = 0 }) {
    const { count, rows } = await Game.findAndCountAll({
      where: { user_id: userId },
      limit,
      offset,
      order: [['updated_at', 'DESC']],
    });
    return { total: count, games: rows };
  }

  async findSharedByStudentId(studentId, { limit = 20, offset = 0 }) {
    const { count, rows } = await Game.findAndCountAll({
      where: { user_id: studentId, shared_with_trainer: true },
      limit,
      offset,
      order: [['updated_at', 'DESC']],
      include: [{ association: 'user', attributes: ['id', 'first_name', 'last_name', 'email', 'role'] }],
    });
    return { total: count, games: rows };
  }

  async update(id, gameData) {
    const game = await Game.findByPk(id);
    if (!game) return null;
    await game.update(gameData);
    return game;
  }

  async delete(id) {
    const game = await Game.findByPk(id);
    if (!game) return false;
    await game.destroy();
    return true;
  }
}

module.exports = new GameRepository();