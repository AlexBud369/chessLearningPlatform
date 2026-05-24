const gameService = require('../services/gameService');

class GameController {
  async upload(req, res, next) {
    try {
      const { pgn, result, datePlayed } = req.body;
      if (!pgn) {
        return res.status(400).json({ message: 'PGN data is required' });
      }
      const game = await gameService.uploadGame(req.user.id, pgn, result, datePlayed);
      res.status(201).json(game);
    } catch (error) {
      next(error);
    }
  }

  async getUserGames(req, res, next) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const result = await gameService.getUserGames(req.user.id, parseInt(page), parseInt(limit));
      res.json({
        games: result.games,
        total: result.total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(result.total / limit),
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const game = await gameService.getGameById(req.params.id);
      res.json(game);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const game = await gameService.updateGame(req.params.id, req.body);
      res.json(game);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await gameService.deleteGame(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new GameController();