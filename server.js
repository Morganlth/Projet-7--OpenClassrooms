// #REQUIRES

const
checkImageFolder = require('./utils').checkImageFolder,
express = require('express'),
mongoose = require('mongoose'),
path = require('path'),
router = require('./router'),
setHeaders = require('./utils').setHeaders

// #TEST

checkImageFolder() //verifie si le dossier './images' exist / si non il le crée

// #CONSTANTE

const app = express()

// #MIDDLEWARES

app.use(express.json())
app.use(setHeaders)

    // #DATABASE

    mongoose.connect('mongodb+srv://user_0:Projet-7-OpenClassrooms@cluster0.qfbp1my.mongodb.net/mon-vieux-grimoire', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() =>
    {
        console.log('Connexion à MongoDB réussie !')

        // ouvre les routes
        app.use('/api', router)
        app.use('/images', express.static(path.join(__dirname, 'images')))
    })
    .catch(() =>
    {
        console.log('Connexion à MongoDB échouée !')

        // routes fermées car database indisponible
        app.use('/api', (req, res) => res.status(503).json({ message: 'database inaccessible !' }))
    })

// #START-LISTEN

app.listen(process.env.PORT || 4000)