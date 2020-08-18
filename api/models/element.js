const mongoose = require('mongoose');

const elementSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true
    }
}, {
    collection: 'Element'
});

module.exports = mongoose.model('Element', elementSchema);