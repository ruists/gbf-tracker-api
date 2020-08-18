const mongoose = require('mongoose');

const raritySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true
    }
}, {
    collection: 'Rarity'
});

module.exports = mongoose.model('Rarity', raritySchema);