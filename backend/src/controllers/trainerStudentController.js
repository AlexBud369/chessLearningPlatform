const trainerStudentService = require('../services/trainerStudentService');
const gameService = require('../services/gameService');

class TrainerStudentController {
  async addStudent(req, res, next) {
    try {
      const trainerId = req.user.id;
      const { studentId } = req.body;
      const relation = await trainerStudentService.addStudent(trainerId, studentId);
      res.status(201).json(relation);
    } catch (error) {
      next(error);
    }
  }

  async getMyStudents(req, res, next) {
    try {
      const trainerId = req.user.id;
      const students = await trainerStudentService.getStudentsByTrainer(trainerId);
      res.json(students);
    } catch (error) {
      next(error);
    }
  }

  async getStudentGames(req, res, next) {
    try {
      const trainerId = req.user.id;
      const { studentId } = req.params;
      const { page = 1, limit = 20 } = req.query;
      const result = await gameService.getStudentGamesForTrainer(
        trainerId,
        Number(studentId),
        parseInt(page, 10),
        parseInt(limit, 10)
      );
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

  async removeStudent(req, res, next) {
    try {
      const trainerId = req.user.id;
      const { studentId } = req.params;
      await trainerStudentService.removeStudent(trainerId, studentId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async searchPlayers(req, res, next) {
    try {
      const { q = '' } = req.query;
      const players = await trainerStudentService.searchPlayers(q);
      res.json(players);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TrainerStudentController();
