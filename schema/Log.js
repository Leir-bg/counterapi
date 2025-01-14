const mongoose = require('mongoose')

const Log = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    date: Date,
    namespace: String,
    identifier: String
}, {versionKey: false})

module.exports = mongoose.model('Log', Log)