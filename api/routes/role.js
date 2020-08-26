const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Role = require('../models/role');

router.get('/', (req, res, next) => {
    Role.find()
        .select('-__v')
        .exec()
        .then(result => {
            const response = {
                count: result.length,
                roles: result.map(role => {
                    return {
                        ...role.toJSON(),
                        request: {
                            type: 'GET',
                            url: req.protocol + '://' + req.get('host') + '/role/' + role._id,
                        }
                    }
                })
            };
            res.status(200).json(response);
        }).catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

router.post('/', (req, res, next) => {
    const role = new Role({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name
    });
    return role.save()
        .then(result => {
            const response = {
                message: 'Created role successfully.',
                role: {
                    ...result.toJSON()
                }
            };
            res.status(201).json(response);
        }).catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;