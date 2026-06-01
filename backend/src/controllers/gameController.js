const gameService = require('../services/gameService');

class GameController {
  async upload(req, res, next) {
    try {
      const { pgn, result, datePlayed, title, student_note, shared_with_trainer } = req.body;
      if (!pgn) {
        return res.status(400).json({ message: 'PGN data is required' });
      }
      const game = await gameService.uploadGame(req.user.id, {
        pgn,
        result,
        datePlayed,
        title,
        student_note,
        shared_with_trainer,
      });
      res.status(201).json(game);
    } catch (error) {
      next(error);
    }
  }

  async getUserGames(req, res, next) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const result = await gameService.getUserGames(req.user.id, parseInt(page, 10), parseInt(limit, 10));
      res.json({
        games: result.games,
        total: result.total,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        totalPages: Math.ceil(result.total / parseInt(limit, 10)),
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const game = await gameService.getGameById(req.params.id, req.user);
      res.json(game);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { pgn, result, datePlayed, title, student_note, shared_with_trainer } = req.body;
      const game = await gameService.updateGame(req.params.id, req.user, {
        pgn,
        result,
        date_played: datePlayed,
        title,
        student_note,
        shared_with_trainer,
      });
      res.json(game);
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await gameService.deleteGame(req.params.id, req.user);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new GameController();
