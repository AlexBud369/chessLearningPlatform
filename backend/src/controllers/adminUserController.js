const adminUserService = require('../services/adminUserService');

class AdminUserController {
  async getAllUsers(req, res, next) {
    try {
      const { page = 1, limit = 20 } = req.query;
      const result = await adminUserService.getAllUsers(parseInt(page), parseInt(limit));
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async setBlockedStatus(req, res, next) {
    try {
      const { isBlocked } = req.body;
      if (typeof isBlocked !== 'boolean') {
        return res.status(400).json({ message: 'isBlocked must be a boolean' });
      }
      const user = await adminUserService.setBlockedStatus(
        req.params.id,
        isBlocked,
        req.user.id
      );
      res.json(user);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AdminUserController();
