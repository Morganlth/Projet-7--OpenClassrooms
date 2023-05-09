// #REQUIRES

const
asyncLib = require('async'),
bcrypt = require('bcrypt'),
jwt = require('jsonwebtoken'),
JWT_KEY = require('../constants').JWT_KEY,
EMAIL_REGEX = require('../constants').EMAIL_REGEX,
User = require('../models/User'),
isNull = require('../utils').isNull,
errorManager = require('../utils').errorManager

// #EXPORT

module.exports =
{
    signup: async (req, res) =>
    {
        asyncLib.waterfall(
        [
            (callback) =>
            {
                getParams(req.body)
                .then(resParams => callback(null, resParams))
                .catch(errParams => errorManager(res, errParams, 400))
            }
        ,
            (params, callback) =>
            {
                const [email, password] = params

                getUser(email)
                .then(resUser => resUser instanceof User ? errorManager(res, null, 409, 'the user already exists !') : callback(email, password))
                .catch(errUser => errorManager(res, errUser, 500))
            }
        ],
            (email, password) =>
            {
                bcrypt.hash(password, 5, (errEncryption, encryptedPassword) =>
                {
                    if (errEncryption) return errorManager(res, errEncryption, 500)

                    new User({ email: email, password: encryptedPassword }).save()
                    .then(() => res.status(201).json({ message: 'you are registered !' }))
                    .catch(errUser => errorManager(res, errUser, 400))
                })
            }
        )
    }
,
    login: (req, res) =>
    {
        asyncLib.waterfall(
        [
            (callback) =>
            {
                getParams(req.body)
                .then(resParams => callback(null, resParams))
                .catch(errParams => errorManager(res, errParams, 400))
            }
        ,
            (params, callback) =>
            {
                const [email, password] = params

                getUser(email)
                .then(resUser => resUser ? callback(resUser, password) : errorManager(res, null, 404, 'unknown user !'))
                .catch(errUser => errorManager(res, errUser, 500))
            }
        ],
            (user, password) =>
            {
                bcrypt.compare(password, user.password, (err, resBcrypt) =>
                {
                    if (err) return errorManager(res, err, 500)

                    if (resBcrypt)
                    {
                        const
                        userId = user._id,
                        token = jwt.sign({ userId: userId }, JWT_KEY, { expiresIn: '1h' })
                        
                        return res.status(200).json({ userId: userId.toString(), token: token })
                    }
                    else return errorManager(res, null, 403, 'invalid password !')
                })
            }
        )
    }
}

// #FUNCTIONS

async function getParams(body)
{
    const email = body.email, password = body.password

    if (isNull(email) || isNull(password) || !EMAIL_REGEX.test(email)) throw new Error('missing email or password !')
    else return [email, password]
}

async function getUser(email)
{
    return User.findOne({ email: email })
}