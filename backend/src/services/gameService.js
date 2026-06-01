const gameRepository = require('../repositories/gameRepository');
const gameAccessService = require('./gameAccessService');
const { parseGameDate } = require('../utils/parseGameDate');

const buildGameUpdatePatch = (updateData, editorId) => {
  const patch = { last_edited_by: editorId };

  if (updateData.pgn !== undefined) patch.pgn = updateData.pgn;
  if (updateData.result !== undefined) patch.result = updateData.result || null;
  if (updateData.title !== undefined) patch.title = updateData.title || null;
  if (updateData.student_note !== undefined) patch.student_note = updateData.student_note || null;
  if (updateData.shared_with_trainer !== undefined) {
    patch.shared_with_trainer = Boolean(updateData.shared_with_trainer);
  }

  if (updateData.date_played !== undefined) {
    if (updateData.date_played === null || updateData.date_played === '') {
      patch.date_played = null;
    } else {
      const parsed = parseGameDate(updateData.date_played);
      if (parsed) patch.date_played = parsed;
    }
  }

  return patch;
};

class GameService {
  async uploadGame(userId, payload) {
    const { pgn, result, datePlayed, title, student_note, shared_with_trainer } = payload;

    const parsedDate = parseGameDate(datePlayed) || new Date();

    const gameData = {
      user_id: userId,
      pgn,
      result: result || null,
      date_played: parsedDate,
      title: title || null,
      student_note: student_note || null,
      shared_with_trainer: Boolean(shared_with_trainer),
      last_edited_by: userId,
    };

    return await gameRepository.create(gameData);
  }

  async getUserGames(userId, page = 1, limit = 10) {
    const offset = (page - 1) * limit;
    return await gameRepository.findAllByUserId(userId, { limit, offset });
  }

  async getStudentGamesForTrainer(trainerId, studentId, page = 1, limit = 20) {
    await gameAccessService.assertTrainerStudent(trainerId, studentId);
    const offset = (page - 1) * limit;
    return await gameRepository.findSharedByStudentId(studentId, { limit, offset });
  }

  async getGameById(gameId, user) {
    return await gameAccessService.assertCanRead(gameId, user);
  }

  async updateGame(gameId, user, updateData) {
    await gameAccessService.assertCanWrite(gameId, user);

    const patch = buildGameUpdatePatch(updateData, user.id);
    const game = await gameRepository.update(gameId, patch);
    if (!game) throw new Error('Game not found');
    return game;
  }

  async deleteGame(gameId, user) {
    await gameAccessService.assertCanDelete(gameId, user);
    const deleted = await gameRepository.delete(gameId);
    if (!deleted) throw new Error('Game not found');
    return true;
  }
}

module.exports = new GameService();
