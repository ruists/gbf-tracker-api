const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require("../models/user");

router.post('/signup', (req, res, next) => {
    User.find({
            email: req.body.email
        }).exec()
        .then(user => {
            if (user.length >= 1) { //user found
                return res.status(409).json({
                    message: 'User already exists.'
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        });
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        });
                        user.save().then(result => {
                            res.status(201).json({
                                message: 'User created.'
                            });
                        }).catch(err => {
                            res.status(500).json({
                                error: err
                            });
                        });
                    }
                });
            }
        });
});

router.post('/login', (req, res, next) => {
    User.find({
            email: req.body.email
        }).exec()
        .then(result => {
            if (result.length < 1) {
                return res.status(401).json({
                    message: 'Authentication failed.'
                });
            }

            //user exists
            bcrypt.compare(req.body.password, user[0].password, (err, equal) => {
                if (err) {
                    res.status(401).json({
                        message: 'Authentication failed.'
                    });
                }
                if (equal) {
                    const token = jwt.sign({
                        email: user[0].email,
                        userId: user[0]._id
                    }, process.env.JWT_KEY, {
                        expiresIn: "1h"
                    });
                    res.status(200).json({
                        message: 'Authentication successful.',
                        token: token
                    });
                } else {
                    res.status(401).json({
                        message: 'Authentication failed.'
                    });
                }
            });
        }).catch(err => {
            return res.status(401).json({
                message: 'Authentication failed.'
            });
        });
});

router.delete('/:userId', (req, res, next) => {
    User.remove(({
            _id: req.params.userId
        }))
        .exec()
        .then(result => {
            if (result.deletedCount) {
                res.status(200).json({
                    message: 'User deleted.'
                });
            } else {
                res.status(404).json({
                    message: 'User not found.'
                });
            }
        }).catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;