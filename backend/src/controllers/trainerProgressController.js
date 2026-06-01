const trainerProgressService = require('../services/trainerProgressService');

class TrainerProgressController {
  async getStudentsProgress(req, res, next) {
    try {
      const progress = await trainerProgressService.getStudentsProgress(req.user.id);
      res.json(progress);
    } catch (error) {
      next(error);
    }
  }

  async getStudentProgress(req, res, next) {
    try {
      const progress = await trainerProgressService.getStudentProgressForTrainer(
        req.user.id,
        req.params.studentId
      );
      res.json(progress);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TrainerProgressController();
