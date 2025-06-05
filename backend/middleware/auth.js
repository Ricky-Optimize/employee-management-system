const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader) {
        return res.status(401).json({ error: 'Access denied' });
    }

    const token = authHeader.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ error: 'Access denied' });
    }

    try {
        jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret', (err, decoded) => {
            if (err) {
                console.error('Token verification error:', {
                    message: err.message,
                    name: err.name
                });
                return res.status(403).json({ error: 'Invalid token' });
            }
            req.user = decoded;
            next();
        });
    } catch (error) {
        console.error('Token verification error:', {
            message: error.message,
            name: error.name
        });
        res.status(403).json({ error: 'Invalid token' });
    }
};