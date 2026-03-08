const errorHandler = (err, _req, res, _next) => {
    console.error(err.stack);

    const status = err.status || 500;
    const message = err.message || 'Internal server error';

    res.status(status).json({ message });
};

module.exports = errorHandler;