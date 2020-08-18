const mongoose = require('mongoose');

const baseSummonSchema = mongoose.Schema({
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
    }
}, {
    collection: 'BaseSummon'
});
baseSummonSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('BaseSummon', baseSummonSchema);