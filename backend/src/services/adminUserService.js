const userRepository = require('../repositories/userRepository');

class AdminUserService {
  async getAllUsers(page = 1, limit = 20) {
    const offset = (page - 1) * limit;
    const { count, rows } = await userRepository.findAllPaginated({ limit, offset });
    return {
      users: rows,
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    };
  }

  async setBlockedStatus(userId, isBlocked, adminId) {
    if (userId === adminId) {
      throw new Error('Cannot block yourself');
    }

    const user = await userRepository.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (user.role === 'admin') {
      throw new Error('Cannot block another administrator');
    }

    return await userRepository.update(userId, { is_blocked: isBlocked });
  }
}

module.exports = new AdminUserService();
