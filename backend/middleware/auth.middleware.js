const jwt = require('jsonwebtoken');

async function standardAuth(req, res, next) {

	const token = req.headers.authorization;

    if (!token) {
        return res.status(401).send({ message: 'Unauthorized.' });
    }
    try {
        jwt.verify(token, process.env.SECRET);
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            // Token verification failed due to invalid token format or signature
            return res.status(401).send({ message: 'Invalid token.' });
        } else if (error.name === 'TokenExpiredError') {
            // Token verification failed due to token expiry
            return res.status(401).send({ message: 'Token expired.' });
        } else {
            // Other unexpected errors
            console.error('JWT verification error:', error);
            return res.status(500).send({ message: 'Internal Server Error.' });
        }
    }
}

async function adminAuth(req, res, next) {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).send({ message: 'Unauthorized.' });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.SECRET);

        if (!decodedToken.isAdmin) {
            return res.status(403).send({ message: 'You do not have permission to access this.' });
        
        }

        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).send({ message: 'Invalid token.' });
        } else if (error.name === 'TokenExpiredError') {
            return res.status(401).send({ message: 'Token expired.' });
        } else {
            console.error('JWT verification error:', error);
            return res.status(500).send({ message: 'Internal Server Error.' });
        }
    }
};

module.exports = {
	standardAuth,
    adminAuth
};