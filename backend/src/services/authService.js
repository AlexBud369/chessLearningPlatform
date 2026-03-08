const userRepository = require('../repositories/userRepository');
const tokenService = require('./tokenService'); 
const bcrypt = require('bcrypt');

class AuthService {
    
    async _findAndCheckUser(email) {
        const user = await userRepository.findByEmail(email);
        if (!user) {
            throw new Error('Invalid credentials');
        }
        if (user.is_blocked) {
            throw new Error('User is blocked');
        }
        return user;
    }


    async register(userData) {
        const { first_name, last_name, email, password, role } = userData;

        const existingUser = await userRepository.findByEmail(email);
        if (existingUser) {
            throw new Error('User already exists');
        }

        const password_hash = await bcrypt.hash(password, 10);

        const newUser = await userRepository.create({
            first_name,
            last_name,
            email,
            password_hash,
            role: role || 'player',
        });

        const { accessToken, refreshToken } = tokenService.generateTokens(newUser.id, newUser.role);
        await tokenService.saveRefreshToken(newUser.id, refreshToken);

        return {
            accessToken,
            refreshToken,
            user: {
                id: newUser.id,
                first_name: newUser.first_name,
                last_name: newUser.last_name,
                email: newUser.email,
                role: newUser.role,
            },
        };
    }

    async login(email, password) {
        const user = await this._findAndCheckUser(email);

        const isValid = await bcrypt.compare(password, user.password_hash);
        if (!isValid) {
            throw new Error('Invalid credentials');
        }

        const { accessToken, refreshToken } = tokenService.generateTokens(user.id, user.role);
        await tokenService.saveRefreshToken(user.id, refreshToken);

        return {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                role: user.role,
            },
        };
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw new Error('Refresh token required'); 
        }

        const payload = tokenService.verifyRefreshToken(refreshToken);

        await tokenService.findAndDeleteRefreshToken(refreshToken);

        const user = await userRepository.findById(payload.id);
        if (!user || user.is_blocked) {
            throw new Error('User not found or blocked');
        }

        const { accessToken, refreshToken: newRefreshToken } = tokenService.generateTokens(user.id, user.role);
        await tokenService.saveRefreshToken(user.id, newRefreshToken);

        return { accessToken, refreshToken: newRefreshToken };
    }

    async logout(refreshToken) {
        if (!refreshToken) return;
        await tokenService.findAndDeleteRefreshToken(refreshToken).catch(() => {});
    }
}

module.exports = new AuthService();