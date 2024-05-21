const jwt = require('jsonwebtoken');
const secretkey = require('dotenv').config();

module.exports = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ message: 'Access Denied. No token provided' });

    try {
        const decoded = jwt.verify(token, process.env.jwtsecret);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token Expired' });
    }
};
