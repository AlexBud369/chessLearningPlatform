const trainerStudentRepository = require('../repositories/trainerStudentRepository');
const userRepository = require('../repositories/userRepository');

class TrainerStudentService {
  async addStudent(trainerId, studentId) {

    const trainer = await userRepository.findById(trainerId);
    if (!trainer) {
      throw new Error('Trainer not found');
    }

    const student = await userRepository.findById(studentId);
    if (!student || student.role !== 'player') {
      throw new Error('Student not found or user is not a player');
    }

    const existing = await trainerStudentRepository.findByTrainerAndStudent(trainerId, studentId);
    if (existing) {
      throw new Error('Student already added to this trainer');
    }
    return await trainerStudentRepository.create({ trainer_id: trainerId, student_id: studentId });
  }

  async getStudentsByTrainer(trainerId) {
    const trainer = await userRepository.findById(trainerId);
    if (!trainer) {
      throw new Error('Only trainers or admins can view students');
    }
    return await trainerStudentRepository.findStudentsByTrainer(trainerId);
  }

  async getTrainersByStudent(studentId) {
    return await trainerStudentRepository.findTrainersByStudent(studentId);
  }

  async removeStudent(trainerId, studentId) {
    const relation = await trainerStudentRepository.findByTrainerAndStudent(trainerId, studentId);
    if (!relation) {
      throw new Error('Relation not found');
    }
    return await trainerStudentRepository.delete(relation.id);
  }

  async searchPlayers(query) {
    return await userRepository.searchPlayers(query);
  }
}

module.exports = new TrainerStudentService();