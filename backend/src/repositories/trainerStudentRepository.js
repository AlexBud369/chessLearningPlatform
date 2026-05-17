const { TrainerStudent, User } = require('../models');
const { Op } = require('sequelize');

class TrainerStudentRepository {
  async create(data) {
    return await TrainerStudent.create(data);
  }

  async findById(id) {
    return await TrainerStudent.findByPk(id);
  }

  async findByTrainerAndStudent(trainerId, studentId) {
    return await TrainerStudent.findOne({
      where: { trainer_id: trainerId, student_id: studentId },
    });
  }

  async findStudentsByTrainer(trainerId) {
    return await TrainerStudent.findAll({
      where: { trainer_id: trainerId },
      include: [
        {
          model: User,
          as: 'student',
          attributes: ['id', 'first_name', 'last_name', 'email', 'avatar', 'is_blocked'],
        },
      ],
    });
  }

  async findTrainersByStudent(studentId) {
    return await TrainerStudent.findAll({
      where: { student_id: studentId },
      include: [
        {
          model: User,
          as: 'trainer',
          attributes: ['id', 'first_name', 'last_name', 'email', 'avatar'],
        },
      ],
    });
  }

  async delete(id) {
    const deletedCount = await TrainerStudent.destroy({ where: { id } });
    return deletedCount > 0;
  }

  async deleteByTrainerAndStudent(trainerId, studentId) {
    const deletedCount = await TrainerStudent.destroy({
      where: { trainer_id: trainerId, student_id: studentId },
    });
    return deletedCount > 0;
  }
}

module.exports = new TrainerStudentRepository();