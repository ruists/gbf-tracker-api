const mongoose = require('mongoose');

const weaponSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    uncap: {
        type: Number,
        required: true
    },
    level: {
        type: Number,
        required: true
    },
    skillLevel: {
        type: Number,
        required: true
    },
    baseWeapon: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BaseWeapon',
        autopopulate: {
            select: '-__v'
        }
    },
    active: {
        type: Boolean,
        required: true,
        default: true
    }
}, {
    collection: 'Weapon'
});
weaponSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('Weapon', weaponSchema);