const express = require('express');
const router = express.Router();
const themeController = require('../controllers/themeController');
const authMiddleware = require('../middleware/auth.middleware');
const { allowRoles } = require('../middleware/role.middleware');

router.get('/', themeController.getAll);
router.get('/:id', themeController.getById);

router.post('/', authMiddleware, allowRoles('trainer'), themeController.create);
router.put('/:id', authMiddleware, allowRoles('trainer'), themeController.update);
router.delete('/:id', authMiddleware, allowRoles('trainer'), themeController.delete);

module.exports = router;