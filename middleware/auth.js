// #REQUIRES

const
JWT_KEY = require('../constants').JWT_KEY,
jwt = require('jsonwebtoken')

// #EXPORT

module.exports = (req, res, next) =>
{
    try
    {
        const
        token = req.headers.authorization.split(' ')[1],
        decodedToken = jwt.verify(token, JWT_KEY)

        req.auth = { userId: decodedToken.userId }

        next()
    }
    catch (err) { res.status(401).json(err) }
}