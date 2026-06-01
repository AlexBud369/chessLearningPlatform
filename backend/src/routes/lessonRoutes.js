const express = require('express');
const router = express.Router();
const lessonController = require('../controllers/lessonController');
const authMiddleware = require('../middleware/auth.middleware');
const { allowRoles } = require('../middleware/role.middleware');

router.get('/course/:courseId', lessonController.getByCourseId);
router.get('/:id', lessonController.getById);
router.get('/course/:courseId/navigation/:lessonId', lessonController.getNavigation);

router.post('/', authMiddleware, allowRoles('trainer'), lessonController.create);
router.put('/:id', authMiddleware, allowRoles('trainer'), lessonController.update);
router.delete('/:id', authMiddleware, allowRoles('trainer'), lessonController.delete);

module.exports = router;