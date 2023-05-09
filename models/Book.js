// #REQUIRE

const mongoose = require('mongoose')

// #SCHEMA

const schema = mongoose.Schema
(
    {
        userId: { type: String, required: true },
        title: { type: String, required: true },
        author: { type: String, required: true },
        imageUrl: { type: String, required: true },
        year: { type: Number, required: true },
        genre: { type: String, required: true },
        ratings:
        [
            {
                userId: { type: mongoose.Schema.Types.ObjectId, required: true },
                grade: { type: Number, min: 0, max: 5, required: true }
            }
        ],
        averageRating: { type: Number, required: true }
    }
)

module.exports = mongoose.model('Book', schema)