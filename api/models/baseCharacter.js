const mongoose = require('mongoose');

const baseCharacterSchema = mongoose.Schema({
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
    race: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Race',
        autopopulate: {
            select: '-__v'
        }
    },
    element: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Element',
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
    },
    style: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Style',
        autopopulate: {
            select: '-__v'
        }
    },
    weaponType: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'WeaponType',
        autopopulate: {
            select: '-__v'
        }
    }]
}, {
    collection: 'BaseCharacter'
});
baseCharacterSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('BaseCharacter', baseCharacterSchema);