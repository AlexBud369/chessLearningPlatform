const gameRepository = require('../repositories/gameRepository');
const trainerStudentRepository = require('../repositories/trainerStudentRepository');

const forbidden = (message = 'Forbidden') => {
  const err = new Error(message);
  err.status = 403;
  return err;
};

const notFound = () => {
  const err = new Error('Game not found');
  err.status = 404;
  return err;
};

class GameAccessService {
  async getGameOrThrow(gameId) {
    const game = await gameRepository.findById(gameId);
    if (!game) throw notFound();
    return game;
  }

  async assertCanRead(gameId, user) {
    const game = await this.getGameOrThrow(gameId);
    if (game.user_id === user.id) return game;

    if (user.role === 'trainer') {
      const link = await trainerStudentRepository.findByTrainerAndStudent(user.id, game.user_id);
      if (link && game.shared_with_trainer) return game;
    }

    throw forbidden();
  }

  async assertCanWrite(gameId, user) {
    const game = await this.assertCanRead(gameId, user);
    if (game.user_id === user.id) return game;

    if (user.role === 'trainer' && game.shared_with_trainer) return game;

    throw forbidden();
  }

  async assertCanDelete(gameId, user) {
    const game = await this.getGameOrThrow(gameId);
    if (game.user_id === user.id) return game;
    throw forbidden();
  }

  async assertTrainerStudent(trainerId, studentId) {
    const link = await trainerStudentRepository.findByTrainerAndStudent(trainerId, studentId);
    if (!link) throw forbidden('Student is not assigned to this trainer');
    return link;
  }
}

module.exports = new GameAccessService();
