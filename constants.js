// #REQUIRE

const getMimetypesObject = require('./utils').getMimetypesObject

// #CONSTANTE

const mimetypes = ['jpeg', 'jpg', 'png'] // controle des extensions de fichiers valides

// #EXPORTS

exports.EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

exports.MIME_TYPES = getMimetypesObject(mimetypes)

exports.MIME_TYPES_REGEX = new RegExp(`.(${mimetypes.toString().replaceAll(',', '|')})$`)

exports.JWT_KEY = '1h0oay1szed65j2wdqa6iop5x5r8yvvsz87c6s98fgiki95q63ghga754'