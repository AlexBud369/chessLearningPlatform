const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');
const authMiddleware = require('../middleware/auth.middleware');
const { allowRoles } = require('../middleware/role.middleware');

router.get('/', courseController.getAll);
router.get('/:id', courseController.getById);

router.post('/', authMiddleware, allowRoles('trainer', 'admin'), courseController.create);
router.put('/:id', authMiddleware, allowRoles('trainer', 'admin'), courseController.update);
router.delete('/:id', authMiddleware, allowRoles('trainer', 'admin'), courseController.delete);

module.exports = router;