module.exports = {
    USER: {
        NAME_MAX_LENGTH: 100,
        EMAIL_MAX_LENGTH: 255,
        PASSWORD_HASH_LENGTH: 100,
        AVATAR_MAX_LENGTH: 255,
    },
     TOKEN: {
        REFRESH_EXPIRES_IN_MS: 7 * 24 * 60 * 60 * 1000,  
    },
    COOKIE: {
        REFRESH_TOKEN_NAME: 'refreshToken',
        MAX_AGE: 7 * 24 * 60 * 60 * 1000,
        HTTP_ONLY: true,
        SAME_SITE: 'strict',
    }
};