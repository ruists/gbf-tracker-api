const mongoose = require('mongoose');

const characterSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        type: String,
        required: true
    },
    level: {
        type: Number,
        required: true
    },
    uncap: {
        type: Number,
        required: true
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
    collection: 'Character'
});
characterSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('Character', characterSchema);