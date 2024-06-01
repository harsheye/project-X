// Define the allowed origin
const allowedOrigin = 'http://localhost:3000';

// Middleware function to check if the request is coming from the allowed origin
const checkOrigin = (req, res, next) => {
    const origin = req.get('origin');
    if (origin !== allowedOrigin) {
        return res.status(403).json({ message: 'Forbidden. Access from this origin is not allowed.' });
    }
    next();
};

// Exporting the middleware function
module.exports = checkOrigin;
