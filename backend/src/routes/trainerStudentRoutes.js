const express = require('express');
const router = express.Router();
const trainerStudentController = require('../controllers/trainerStudentController');
const authMiddleware = require('../middleware/auth.middleware');
const { allowRoles } = require('../middleware/role.middleware');

router.use(authMiddleware);

router.post('/students', allowRoles('trainer', 'admin'), trainerStudentController.addStudent);
router.get('/students', allowRoles('trainer', 'admin'), trainerStudentController.getMyStudents);
router.delete('/students/:studentId', allowRoles('trainer', 'admin'), trainerStudentController.removeStudent);

router.get('/trainers/:trainerId/students', allowRoles('admin'), trainerStudentController.getStudentsByTrainerId);

module.exports = router;