const gameRepository = require('../repositories/gameRepository');

class GameService {
  async uploadGame(userId, pgn, result = null, datePlayed = null) {
    const gameData = {
      user_id: userId,
      pgn,
      result,
      date_played: datePlayed || new Date(),
    };
    return await gameRepository.create(gameData);
  }

  async getUserGames(userId, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    return await gameRepository.findAllByUserId(userId, { limit, offset });
  }

  async getGameById(gameId) {
    const game = await gameRepository.findById(gameId);
    if (!game) {
      throw new Error('Game not found');
    }
    return game;
  }

  async updateGame(gameId, updateData) {
    const game = await gameRepository.update(gameId, updateData);
    if (!game) {
      throw new Error('Game not found');
    }
    return game;
  }

  async deleteGame(gameId) {
    const deleted = await gameRepository.delete(gameId);
    if (!deleted) {
      throw new Error('Game not found');
    }
    return true;
  }
}

module.exports = new GameService();