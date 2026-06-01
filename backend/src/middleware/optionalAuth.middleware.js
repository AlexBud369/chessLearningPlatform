const { verifyAccessToken } = require('../utils/token.utils');
const userRepository = require('../repositories/userRepository');

const optionalAuthMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyAccessToken(token);

    const user = await userRepository.findById(payload.id);
    if (!user || user.is_blocked) {
      return next();
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      first_name: user.first_name,
      last_name: user.last_name,
    };
    next();
  } catch {
    next();
  }
};

module.exports = optionalAuthMiddleware;
