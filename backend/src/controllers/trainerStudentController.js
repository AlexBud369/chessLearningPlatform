const trainerStudentService = require('../services/trainerStudentService');

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

  async getStudentsByTrainerId(req, res, next) {
    try {
      const { trainerId } = req.params;
      const students = await trainerStudentService.getStudentsByTrainer(trainerId);
      res.json(students);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TrainerStudentController();