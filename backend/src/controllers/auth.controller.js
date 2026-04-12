const { setRefreshTokenCookie, clearRefreshTokenCookie } = require('../utils/cookie.utils');
const authService = require('../services/authService');
const userRepository = require('../repositories/userRepository');

class AuthController {
    async register(req, res, next) {
        try {
            const { accessToken, refreshToken, user } = await authService.register(req.body);
            setRefreshTokenCookie(res, refreshToken);
            res.status(201).json({ accessToken, user });
        } catch (error) {
            next(error);
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const { accessToken, refreshToken, user } = await authService.login(email, password);
            setRefreshTokenCookie(res, refreshToken);
            res.json({ accessToken, user });
        } catch (error) {
            next(error);
        }
    }

    async refresh(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const { accessToken, refreshToken: newRefreshToken } = await authService.refresh(refreshToken);
            setRefreshTokenCookie(res, newRefreshToken);
            res.json({ accessToken });
        } catch (error) {
            next(error);
        }
    }

    async logout(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            if (refreshToken) {
                await authService.logout(refreshToken);
            }
            clearRefreshTokenCookie(res);
            res.json({ message: 'Logged out' });
        } catch (error) {
            next(error);
        }
    }

    async getProfile(req, res, next) {
        try {
            const userId = req.user.id; 
            const user = await userRepository.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            const userData = {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                is_blocked: user.is_blocked,
                created_at: user.created_at,
                updated_at: user.updated_at
            };

            res.json({ user: userData });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AuthController();