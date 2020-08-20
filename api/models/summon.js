const mongoose = require('mongoose');

const summonSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    uncap: {
        type: Number,
        required: true
    },
    level: {
        type: Number,
        required: true
    },
    baseSummon: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BaseSummon',
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
    collection: 'Summon'
});
summonSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('Summon', summonSchema);