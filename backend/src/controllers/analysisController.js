const analysisService = require('../services/analysisService');

class AnalysisController {
  async getTree(req, res, next) {
    try {
      const tree = await analysisService.getAnalysisTree(req.params.gameId);
      res.json(tree);
    } catch (error) {
      next(error);
    }
  }

  async addNode(req, res, next) {
    try {
      const node = await analysisService.addNode(req.params.gameId, req.user.id, req.body);
      res.status(201).json(node);
    } catch (error) {
      next(error);
    }
  }

  async updateNode(req, res, next) {
    try {
      const node = await analysisService.updateNode(req.params.nodeId, req.body);
      res.json(node);
    } catch (error) {
      next(error);
    }
  }

  async deleteNode(req, res, next) {
    try {
      await analysisService.deleteNode(req.params.nodeId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async saveFullTree(req, res, next) {
    try {
      const { nodes } = req.body;
      const savedNodes = await analysisService.saveFullTree(req.params.gameId, req.user.id, nodes);
      res.json(savedNodes);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AnalysisController();