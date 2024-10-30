const jwt = require('jsonwebtoken');

const checkAuth = (req, res, next) => {
    try {
        const token = jwt.decode(req.cookies.token);
        if (!token) return res.status(401).json({ message: 'You must be logged in' });
        req.user = token;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = checkAuth;
