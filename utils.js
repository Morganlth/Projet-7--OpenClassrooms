// #EXPORTS

exports.setHeaders = (req, res, next) =>
{
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
    next()
}

exports.getMimetypesObject = (mimetypes) =>
{
    const mimetypesObject = {}

    mimetypes.forEach(m => mimetypesObject[`image/${m}`] = `.${m}`)

    return mimetypesObject
}

exports.isNull = (value) => value === '' || value === null || value === undefined

exports.errorManager = (res, err, status, message) =>
{
    err = err ?? new Error(message ?? 'error')

    try { res.status(status).json(err) } catch { return }
} 
