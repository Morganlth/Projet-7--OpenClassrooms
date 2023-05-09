// #REQUIRES

const
MIME_TYPES = require('../constants').MIME_TYPES,
multer = require('multer')

// #EXPORT

module.exports = multer({ storage: multer.memoryStorage(), fileFilter: getFilter() }).single('image')

// #FUNCTION

function getFilter()
{
    return (req, file, callback) =>
    {
        file.extension = MIME_TYPES[file.mimetype]

        if (file.extension === undefined)
        {
            req.mimetypeError = true // définit une erreur sur le type mime / vu dans les Ctrl

            return callback(null, false)
        }

        return callback(null, true)
    }
}