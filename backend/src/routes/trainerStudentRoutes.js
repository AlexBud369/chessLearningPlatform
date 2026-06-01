const express = require('express');
const router = express.Router();
const trainerStudentController = require('../controllers/trainerStudentController');
const trainerProgressController = require('../controllers/trainerProgressController');
const authMiddleware = require('../middleware/auth.middleware');
const { allowRoles } = require('../middleware/role.middleware');

router.use(authMiddleware);

router.post('/students', allowRoles('trainer'), trainerStudentController.addStudent);
router.get('/students', allowRoles('trainer'), trainerStudentController.getMyStudents);
router.get('/students/search', allowRoles('trainer'), trainerStudentController.searchPlayers);
router.get('/students/progress', allowRoles('trainer'), trainerProgressController.getStudentsProgress);
router.get('/students/:studentId/progress', allowRoles('trainer'), trainerProgressController.getStudentProgress);
router.get('/students/:studentId/games', allowRoles('trainer'), trainerStudentController.getStudentGames);
router.delete('/students/:studentId', allowRoles('trainer'), trainerStudentController.removeStudent);

module.exports = router;