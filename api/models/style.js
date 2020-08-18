const mongoose = require('mongoose');

const styleSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true
    }
}, {
    collection: 'Style'
});

module.exports = mongoose.model('Style', styleSchema);