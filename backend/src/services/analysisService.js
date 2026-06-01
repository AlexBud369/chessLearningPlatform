const analysisNodeRepository = require('../repositories/analysisNodeRepository');
const gameAccessService = require('./gameAccessService');

class AnalysisService {
  async getAnalysisTree(gameId, user) {
    await gameAccessService.assertCanRead(gameId, user);
    const nodes = await analysisNodeRepository.findByGameId(gameId);
    return this.buildTree(nodes);
  }

  buildTree(nodes, parentId = null) {
    const children = nodes.filter(node => node.parent_id === parentId);
    return children.map(node => ({
      id: node.id,
      fen: node.fen,
      move_from: node.move_from,
      move_to: node.move_to,
      comment: node.comment,
      is_main: node.is_main,
      children: this.buildTree(nodes, node.id),
    }));
  }

  async addNode(gameId, userId, nodeData) {
    const game = await gameRepository.findById(gameId);
    if (!game) {
      throw new Error('Game not found');
    }
    const newNode = {
      game_id: gameId,
      user_id: userId,
      parent_id: nodeData.parent_id || null,
      fen: nodeData.fen,
      move_from: nodeData.move_from,
      move_to: nodeData.move_to,
      comment: nodeData.comment,
      is_main: nodeData.is_main || false,
    };
    return await analysisNodeRepository.create(newNode);
  }

  async updateNode(nodeId, updateData) {
    const node = await analysisNodeRepository.update(nodeId, updateData);
    if (!node) {
      throw new Error('Analysis node not found');
    }
    return node;
  }

  async deleteNode(nodeId) {
    const deleted = await analysisNodeRepository.delete(nodeId);
    if (!deleted) {
      throw new Error('Analysis node not found');
    }
    return true;
  }

  async deleteAllNodesForGame(gameId) {
    await analysisNodeRepository.deleteByGameId(gameId);
  }

  async saveFullTree(gameId, user, nodesData) {
    await gameAccessService.assertCanWrite(gameId, user);
    await this.deleteAllNodesForGame(gameId);
    const created = [];

    for (const nodeData of nodesData) {
      const parent_id = created.length === 0 ? null : created[created.length - 1].id;
      const node = await analysisNodeRepository.create({
        game_id: gameId,
        user_id: user.id,
        parent_id,
        fen: nodeData.fen,
        move_from: nodeData.move_from || null,
        move_to: nodeData.move_to || null,
        comment: nodeData.comment || null,
        is_main: nodeData.is_main ?? true,
      });
      created.push(node);
    }

    return created;
  }
}

module.exports = new AnalysisService();