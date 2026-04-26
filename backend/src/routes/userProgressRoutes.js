const express = require('express');
const router = express.Router();
const userProgressController = require('../controllers/userProgressController');
const authMiddleware = require('../middleware/auth.middleware');
const { allowRoles } = require('../middleware/role.middleware');

router.use(authMiddleware);

router.post('/lesson', userProgressController.markLessonCompleted);
router.get('/course/:courseId', userProgressController.getUserProgressForCourse);
router.get('/course/:courseId/status', userProgressController.getCourseCompletionStatus);
router.get('/summary', userProgressController.getUserProgressSummary);

router.get('/user/:userId/summary', allowRoles('admin', 'trainer'), userProgressController.getProgressByUserId);

module.exports = router;