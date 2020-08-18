const mongoose = require('mongoose');

const raceSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true
    }
}, {
    collection: 'Race'
});

module.exports = mongoose.model('Race', raceSchema);