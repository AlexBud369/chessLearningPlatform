const { verifyAccessToken } = require('../utils/token.utils');
const userRepository = require('../repositories/userRepository');

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];
        const payload = verifyAccessToken(token);

        const user = await userRepository.findById(payload.id);
        if (!user || user.is_blocked) {
            return res.status(401).json({ message: 'User not found or blocked' });
        }

        req.user = {
            id: user.id,
            email: user.email,
            role: user.role,
            first_name: user.first_name,
            last_name: user.last_name,
        };
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        }
        return res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = authMiddleware;