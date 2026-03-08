const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/token.utils');
const refreshTokenRepository = require('../repositories/refreshTokenRepository');
const  { TOKEN } = require('../constants')

class TokenService {
    generateTokens(userId, role) {
        return {
            accessToken: generateAccessToken(userId, role),
            refreshToken: generateRefreshToken(userId),
        };
    }

    verifyRefreshToken(token) {
        try {
            return verifyRefreshToken(token);
        } catch (e) {
            throw new Error('Invalid refresh token');
        }
    }

    async saveRefreshToken(userId, refreshToken) {
        const expiresAt = new Date(Date.now() + TOKEN.REFRESH_EXPIRES_IN_MS); 
        await refreshTokenRepository.create({
            token: refreshToken,
            user_id: userId,
            expires_at: expiresAt,
        });
    }

    async findAndDeleteRefreshToken(refreshToken) {
        const storedToken = await refreshTokenRepository.findByToken(refreshToken);
        if (!storedToken) {
            throw new Error('Refresh token not found');
        }
        await refreshTokenRepository.deleteByToken(refreshToken);
        return storedToken;
    }

    async deleteAllForUser(userId) {
        await refreshTokenRepository.deleteAllForUser(userId);
    }
}

module.exports = new TokenService(); 