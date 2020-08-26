const mongoose = require('mongoose');

const characterSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    level: {
        type: Number,
        required: true
    },
    uncap: {
        type: Number,
        required: true
    },
    baseCharacter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BaseCharacter',
        autopopulate: {
            select: '-__v'
        }
    }
}, {
    collection: 'Character'
});
characterSchema.plugin(require('mongoose-autopopulate'));

module.exports = mongoose.model('Character', characterSchema);