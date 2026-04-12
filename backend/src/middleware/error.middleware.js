const errorHandler = (err, _req, res, _next) => {
    console.error(err.stack);

    let status = err.status || 500;
    let message = err.message || 'Internal server error';

    if (message === 'Invalid credentials') {
        status = 401;
        message = 'Invalid email or password';
    } else if (message === 'User already exists') {
        status = 409;
        message = 'User with this email already exists';
    } else if (message === 'Refresh token required' || message === 'User not found or blocked') {
        status = 401;
        message = 'Authentication failed';
    } else if (message === 'User is blocked') {
        status = 403;
        message = 'Your account has been blocked';
    }

    if (err.array && typeof err.array === 'function') {
        status = 400;
        message = err.array().map(e => e.msg).join(', ');
    }

    res.status(status).json({ message });
};

module.exports = errorHandler;