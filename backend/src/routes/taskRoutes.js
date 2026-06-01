const express = require('express');
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middleware/auth.middleware');
const optionalAuthMiddleware = require('../middleware/optionalAuth.middleware');
const { allowRoles } = require('../middleware/role.middleware');

const router = express.Router();

router.get('/difficulties', taskController.getDifficulties);
router.get('/', optionalAuthMiddleware, taskController.getAll);
router.get('/:id', taskController.getById);

router.post('/', authMiddleware, allowRoles('trainer'), taskController.create);
router.put('/:id', authMiddleware, allowRoles('trainer'), taskController.update);
router.delete('/:id', authMiddleware, allowRoles('trainer'), taskController.delete);

router.post('/:id/solve', authMiddleware, taskController.solve);
router.post('/:id/complete', authMiddleware, taskController.complete);

module.exports = router;