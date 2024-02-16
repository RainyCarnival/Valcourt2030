const jwt = require('jsonwebtoken');

async function standardAuth(req, res, next) {

    const authorization = req.headers.authorization;
    // --------------> TESTING METHOD, DELETE LATER AND COMMENT THE REST
    if (authorization !== "admin") {
        if (!authorization) {
            res.status(401);
            res.send({
                message: 'Unauthorized'
            })
            return
        }
        try {
            jwt.verify(authorization, process.env.SECRET);
            next();
        } catch (err) {
            res.status(401);
            res.send({
                message: 'Unauthorized'
            })
        }
    } else {
        next()
    }

// ------------------> DELETE TO HERE AND UNCOMMENT THE REST



    /*
    if (!authorization) {
        res.status(401);
        res.send({
            message: 'Unauthorized'
        })
        return
    }
    try {
        jwt.verify(authorization, process.env.SECRET);
        next();
    } catch (err) {
        res.status(401);
        res.send({
            message: 'Unauthorized'
        })
    }
    */
}

module.exports = {
    standardAuth,
}