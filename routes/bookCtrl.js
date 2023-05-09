// #REQUIRES

const
MIME_TYPES_REGEX = require('../constants').MIME_TYPES_REGEX,
asyncLib = require('async'),
fs = require('fs'),
Book = require('../models/Book'),
isNull = require('../utils').isNull,
errorManager = require('../utils').errorManager

// #EXPORT

module.exports =
{
    read: (req, res) =>
    {
        getBooks(res, req.params.id)
    }
,
    readAll: (req, res) =>
    {
        getBooks(res)
    }
,
    readPodium: (req, res) =>
    {
        asyncLib.waterfall(
        [
            (callback) =>
            {
                getBooks(res, null, true)
                .then(resBook => callback(resBook))
            }
        ],
            (book) =>
            {
                const
                sortedBooks = book.sort((book1, book2) => book2.averageRating - book1.averageRating),
                podium = []
    
                let i = 0
    
                while (i < 3 && i < sortedBooks.length) podium.push(sortedBooks[i++])
    
                res.status(200).json(podium)
            }
        )
    }
,
    create: (req, res) =>
    {
        const file = req.file
    
        if (req.mimetypeError || !file) return errorManager(res, null, 400, 'bad mimetype !')
    
        const
        book = JSON.parse(req.body.book),
        userId = req.auth.userId
        
        for (const info in book) if (isNull(book[info])) return errorManager(res, null, 400, 'missing parameters !')

        if (isNaN(parseInt(book.year, 10))) return errorManager(res, null, 400, 'missing parameters !')
    
        book.userId = userId, book.ratings[0].userId = userId
        file.path = getPathFile(file.originalname)

        asyncLib.waterfall(
        [
            (callback) =>
            {
                new Book({ ...book, imageUrl: getUrl(req) + file.path }).save()
                .then(() => callback())
                .catch(err => errorManager(res, err, 400))
            }
        ],
            () =>
            {
                saveFile(file)
                .then(() => res.status(201).json({ message: 'Book created !'}))
                .catch(errFile => errorManager(res, errFile, 500))
            }
        )
    }
,
    createRating: (req, res) =>
    {
        const
        rating = req.body.rating,
        id = req.params.id

        if (isNull(rating) || rating < 0 || rating > 5) return errorManager(res, null, 400, 'missing parameters !')

        asyncLib.waterfall(
        [
            (callback) =>
            {
                getBooks(res, id, true)
                .then(resBook => callback(resBook))
            }
        ],
            (book) =>
            {
                if (!book) return errorManager(res, null, 404, 'unknown book !')

                const
                userId = req.auth.userId,
                modifiedBook = getNewRating(book, userId, rating)

                updateBook(id, { ratings: modifiedBook.ratings, averageRating: modifiedBook.averageRating })
                .then(() => res.status(201).json(modifiedBook))
                .catch(errBook => errorManager(res, errBook, 500))
            }
        )
    }
,
    update: (req, res) =>
    {
        if (req.mimetypeError) return errorManager(res, null, 400, 'bad mimetype !')

        const
        file = req.file,
        book = file ? JSON.parse(req.body.book) : req.body,
        userId = req.auth.userId,
        id = req.params.id
    
        asyncLib.waterfall(
        [
            (callback) =>
            {
                getBooks(res, id, true)
                .then(resBook => callback(null, resBook))
            }
        ,
            (bookBeforeChange, callback) =>
            {
                if (!bookBeforeChange) return errorManager(res, null, 404, 'unknown book !')
                if (bookBeforeChange.userId !== userId) return errorManager(res, null, 400, 'not allowed !')

                const
                modifiedParams = {},
                url = getUrl(req)

                for (const e in book) book[e] !== bookBeforeChange[e] ? modifiedParams[e] = book[e] : null
                
                if (file)
                {
                    file.path = getPathFile(file.originalname)

                    modifiedParams.imageUrl = url + file.path

                    saveFile(file)
                    .then(() =>
                    {
                        removeFile(bookBeforeChange, url)

                        callback(id, modifiedParams)
                    })
                    .catch(errFile => errorManager(res, errFile, 500))
                }
                else callback(id, modifiedParams)
            }
        ],
            (id, modifiedParams) =>
            {
                updateBook(id, modifiedParams)
                .then(() => res.status(201).json({ message: 'modified book !' }))
                .catch(errBook => errorManager(res, errBook, 500))
            }
        )
    }
,
    delete: (req, res) =>
    {
        const
        id = req.params.id,
        userId = req.auth.userId

        asyncLib.waterfall(
        [
            (callback) =>
            {
                getBooks(res, id, true)
                .then(resBook => callback(resBook))
            }
        ],
            (book) =>
            {
                if (!book) return errorManager(res, null, 404, 'unknown book !')

                book.userId === userId ?
                Book.deleteOne({ _id: id })
                .then(() =>
                {
                    removeFile(book, getUrl(req))

                    res.status(200).json({ message: 'book deleted !' })
                })
                .catch(errBook => errorManager(res, errBook, 500))
                : errorManager(res, null, 400, 'not allowed !')
            }
        )
    }
}

// #FUNCTIONS

async function getBooks(res, id, toReturn)
{
    try
    {
        const books = await (id ? Book.findById(id) : Book.find())

        return toReturn ? books : res.status(200).json(books)
    }
    catch (err) { errorManager(res, err, 500) }
}

function updateBook(id, modifiedParams)
{
    return Book.updateOne({ _id: id }, { ...modifiedParams })
}

function getNewRating(book, userId, rating)
{
    const ratings = book.ratings.filter(r => r.userId !== userId)
    
    ratings.push({ userId: userId, grade: rating })

    const averageRating = ratings.reduce((accumulateur, r) => accumulateur += r.grade, 0) / ratings.length

    book.ratings = ratings
    book.averageRating = Math.round(averageRating*10) / 10

    return book
}

function getUrl(req)
{
    return `${req.protocol}://${req.get('host')}/`
}

function getPathFile(originalname)
{
    return 'images/' + Date.now() + originalname.replace(MIME_TYPES_REGEX, '.jpeg').replaceAll(' ', '_')
}

function saveFile(file)
{
    const sharp = require('sharp')

    return sharp(file.buffer)
    .resize(null, 568)
    .toFormat('jpeg')
    .jpeg({ force: true })
    .toFile(file.path)
}

function removeFile(book, url)
{
    const path = book.imageUrl.replace(url, '')

    fs.unlink(path, err => null)
}