const express = require('express');
const adminUserController = require('../controllers/adminUserController');
const authMiddleware = require('../middleware/auth.middleware');
const { allowRoles } = require('../middleware/role.middleware');

const router = express.Router();

router.use(authMiddleware, allowRoles('admin'));

router.get('/users', adminUserController.getAllUsers);
router.patch('/users/:id/block', adminUserController.setBlockedStatus);

module.exports = router;
