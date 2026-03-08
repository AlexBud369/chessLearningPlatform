const { COOKIE } = require('../constants');

const setRefreshTokenCookie = (res, refreshToken) => {
    res.cookie(COOKIE.REFRESH_TOKEN_NAME, refreshToken, {
        httpOnly: COOKIE.HTTP_ONLY,
        secure: process.env.NODE_ENV === 'production',
        sameSite: COOKIE.SAME_SITE,
        maxAge: COOKIE.MAX_AGE,
    });
};

const clearRefreshTokenCookie = (res) => {
    res.clearCookie(COOKIE.REFRESH_TOKEN_NAME);
};

module.exports = { setRefreshTokenCookie, clearRefreshTokenCookie };