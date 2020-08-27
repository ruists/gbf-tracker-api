const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: {
        type: String,
        required: true,
        unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Role',
        autopopulate: {
            select: '-__v'
        }
    }
}, {
    collection: 'User'
});
userSchema.plugin(require('mongoose-autopopulate'));

userSchema.pre('save', async function (next) {
    const user = this;
    console.log('Trying to hash password...');
    bcrypt.hash(this.password, 10, (err, hash) => {
        if (err) {
            console.log('error hash');
            throw err;
        }

        console.log('hashed password successfully...')
        this.password = hash;
        next();
    });
});

module.exports = mongoose.model('User', userSchema);