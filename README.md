# Projet-7--OpenClassrooms
# Développez le back-end d'un site de notation de livres

# node version - v18.16.0

## INIT

npm install --save

## START

npm start

-- or with nodemon (not installed by default)

nodemon start

## TREE

./images
                    ...your images recorded by the database
./middleware
    auth.js         -> user authentication
    multer.js       -> upload files
./models
    Book.js         -> Book schema
    User.js         -> User schema
./routes
    bookCtrl.js     -> book routes
    userCtrl.js     -> user routes

constants.js        -> constants
router.js           -> router
server.js           -> server / entry point
utils.js            -> server utility functions