const errorHandler = (error, req, res, next) => {
    console.error('Error:', {
        message: error.message,
        stack: error.stack,
        path: req.path,
        method: req.method,
        code: error.code,
        errno: error.errno,
        sqlMessage: error.sqlMessage
    });
    res.status(error.status || 500).json({
        error: error.message || 'Internal server error'
    });
};

module.exports = errorHandler;