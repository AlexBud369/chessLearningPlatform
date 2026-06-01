const { AnalysisNode } = require('../models');
const { Op } = require('sequelize');

class AnalysisNodeRepository {
  async create(nodeData) {
    return await AnalysisNode.create(nodeData);
  }

  async createMany(nodesData) {
    return await AnalysisNode.bulkCreate(nodesData);
  }

  async findByGameId(gameId) {
    return await AnalysisNode.findAll({
      where: { game_id: gameId },
      order: [['created_at', 'ASC']],
    });
  }

  async findByGameAndParent(gameId, parentId = null) {
    return await AnalysisNode.findAll({
      where: { game_id: gameId, parent_id: parentId },
      order: [['order', 'ASC'], ['created_at', 'ASC']],
    });
  }

  async update(id, updateData) {
    const node = await AnalysisNode.findByPk(id);
    if (!node) return null;
    await node.update(updateData);
    return node;
  }

  async deleteByGameId(gameId) {
    return await AnalysisNode.destroy({ where: { game_id: gameId } });
  }

  async delete(id) {
    const node = await AnalysisNode.findByPk(id);
    if (!node) return false;
    await node.destroy();
    return true;
  }
}

module.exports = new AnalysisNodeRepository();