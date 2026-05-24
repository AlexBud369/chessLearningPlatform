const express = require('express');
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middleware/auth.middleware');
const { allowRoles } = require('../middleware/role.middleware');

const router = express.Router();

router.get('/', taskController.getAll);
router.get('/:id', taskController.getById);

router.post('/', authMiddleware, allowRoles('trainer', 'admin'), taskController.create);
router.put('/:id', authMiddleware, allowRoles('trainer', 'admin'), taskController.update);
router.delete('/:id', authMiddleware, allowRoles('trainer', 'admin'), taskController.delete);

router.post('/:id/solve', authMiddleware, taskController.solve);

module.exports = router;