// #REQUIRES

const
express = require('express'),
auth = require('./middleware/auth'),
multer = require('./middleware/multer')
userCtrl = require('./routes/userCtrl'),
bookCtrl = require('./routes/bookCtrl')

// #ROUTER

const router = express.Router()

router.route('/auth/signup').post(userCtrl.signup)
router.route('/auth/login').post(userCtrl.login)

router.route('/books').get(bookCtrl.readAll)
router.route('/books').post(auth, multer, bookCtrl.create)
router.route('/books/bestrating').get(bookCtrl.readPodium)
router.route('/books/:id/rating').post(auth, bookCtrl.createRating)
router.route('/books/:id').get(bookCtrl.read)
router.route('/books/:id').put(auth, multer, bookCtrl.update)
router.route('/books/:id').delete(auth, bookCtrl.delete)

module.exports = router