const analysisNodeRepository = require('../repositories/analysisNodeRepository');
const gameRepository = require('../repositories/gameRepository');

class AnalysisService {
  async getAnalysisTree(gameId) {
    const nodes = await analysisNodeRepository.findByGameId(gameId);
    const tree = this.buildTree(nodes);
    return tree;
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

  async saveFullTree(gameId, userId, nodesData) {
    await this.deleteAllNodesForGame(gameId);
    const nodesToCreate = nodesData.map(node => ({
      game_id: gameId,
      user_id: userId,
      parent_id: node.parent_id,
      fen: node.fen,
      move_from: node.move_from,
      move_to: node.move_to,
      comment: node.comment,
      is_main: node.is_main,
    }));
    return await analysisNodeRepository.createMany(nodesToCreate);
  }
}

module.exports = new AnalysisService();