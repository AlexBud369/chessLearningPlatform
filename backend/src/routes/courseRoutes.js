const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const authMiddleware = require('../middleware/auth.middleware');
const optionalAuthMiddleware = require('../middleware/optionalAuth.middleware');
const { allowRoles } = require('../middleware/role.middleware');

router.get('/', optionalAuthMiddleware, courseController.getAll);
router.get('/:id', courseController.getById);

router.post('/', authMiddleware, allowRoles('trainer'), courseController.create);
router.put('/:id', authMiddleware, allowRoles('trainer'), courseController.update);
router.delete('/:id', authMiddleware, allowRoles('trainer'), courseController.delete);

router.post(
  '/:id/cover',
  authMiddleware,
  allowRoles('trainer'),
  courseController.uploadCover,
  courseController.handleUploadCover
);

module.exports = router;