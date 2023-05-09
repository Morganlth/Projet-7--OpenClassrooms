# Projet 7 - OpenClassrooms  
## Développez le back-end d'un site de notation de livres  

__node version - v18.16.0__  

### INIT  

*npm install --save*  

### START  

*npm start*  

-- or with nodemon (not installed by default)  

*nodemon start*  

### TREE  

* /images  
                        __...your images recorded by the database__
* /middleware
    `* auth.js`         __user authentication__
    `* multer.js`       __upload files__
* /models
    `* Book.js`         __Book schema__
    `* User.js`         __User schema__
* /routes
    `* bookCtrl.js`     __book routes__
    `* userCtrl.js`     __user routes__

* constants.js          __constants__
* router.js             __router__
* server.js             __server / entry point__
* utils.js              __server utility functions__