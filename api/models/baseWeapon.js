const mongoose = require('mongoose');

const baseWeaponSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true
    },
    maxUncap: {
        type: Number,
        required: true
    },
    imgUrl: {
        type: String,
        required: true
    },
    usesSkillLevel: {
        type: Boolean,
        required: true
    },
    element: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Element',
        autopopulate: {
            select: '-__v'
        }
    },
    weaponType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'WeaponType',
        autopopulate: {
            select: '-__v'
        }
    },
    rarity: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Rarity',
        autopopulate: {
            select: '-__v'
        }
    }
}, {
    collection: 'BaseWeapon'
});
baseWeaponSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('BaseWeapon', baseWeaponSchema);