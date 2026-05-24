const express = require('express');
const assignedCourseController = require('../controllers/assignedCourseController');
const authMiddleware = require('../middleware/auth.middleware');
const { allowRoles } = require('../middleware/role.middleware');

const router = express.Router();

router.post('/assign', authMiddleware, allowRoles('trainer', 'admin'), assignedCourseController.assign);
router.delete('/assign/:studentId/:courseId', authMiddleware, allowRoles('trainer', 'admin'), assignedCourseController.remove);

router.get('/my-courses', authMiddleware, assignedCourseController.getMyCourses);
router.get('/course/:courseId/students', authMiddleware, allowRoles('trainer', 'admin'), assignedCourseController.getCourseStudents);
router.get('/check/:studentId/:courseId', authMiddleware, assignedCourseController.checkAssigned);

module.exports = router;