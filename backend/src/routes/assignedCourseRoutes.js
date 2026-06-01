const express = require('express');
const assignedCourseController = require('../controllers/assignedCourseController');
const authMiddleware = require('../middleware/auth.middleware');
const { allowRoles } = require('../middleware/role.middleware');

const router = express.Router();

router.post('/assign', authMiddleware, allowRoles('trainer'), assignedCourseController.assign);
router.post('/assign/bulk', authMiddleware, allowRoles('trainer'), assignedCourseController.assignBulk);
router.delete('/assign/:studentId/:courseId', authMiddleware, allowRoles('trainer'), assignedCourseController.remove);
router.get('/trainer/assignments', authMiddleware, allowRoles('trainer'), assignedCourseController.getTrainerAssignments);

router.get('/my-courses', authMiddleware, assignedCourseController.getMyCourses);
router.get('/course/:courseId/students', authMiddleware, allowRoles('trainer'), assignedCourseController.getCourseStudents);
router.get('/check/:studentId/:courseId', authMiddleware, assignedCourseController.checkAssigned);

module.exports = router;