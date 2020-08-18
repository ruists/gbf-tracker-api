const mongoose = require('mongoose');

const weaponTypeSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true
    }
}, {
    collection: 'WeaponType'
});

module.exports = mongoose.model('WeaponType', weaponTypeSchema);