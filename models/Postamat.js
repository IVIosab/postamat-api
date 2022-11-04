const mongoose = require('mongoose')

const postamatSchema = new mongoose.Schema({
    address: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    district: {
        type: String,
        required: true
    },
    adminstrativeDistrict: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    lat: {
        type: Number,
        required: true
    },
    lon: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('postamat', postamatSchema)