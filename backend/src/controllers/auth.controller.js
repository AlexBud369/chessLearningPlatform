const { setRefreshTokenCookie, clearRefreshTokenCookie } = require('../utils/cookie.utils');
const authService = require('../services/authService');
const tokenService = require('../services/tokenService');

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
}

module.exports = new AuthController();