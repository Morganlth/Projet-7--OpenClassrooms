// #REQUIRE

const mongoose = require('mongoose')

// #SCHEMA

const schema = mongoose.Schema
(
    {
        email: { type: String, unique: true, required: true },
        password: { type: String, required: true }
    }
)

module.exports = mongoose.model('User', schema)