const mongoose = require('mongoose')

const User = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    namespace: String,
    identifier: String
}, {versionKey: false})

module.exports = mongoose.model('User', User)