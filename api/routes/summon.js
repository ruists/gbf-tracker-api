const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Summon = require('../models/summon');

router.get('/', (req, res, next) => {
    Summon.find()
        .select('-__v')
        .exec()
        .then(result => {
            const response = {
                count: result.length,
                summons: result.map(summon => {
                    return {
                        ...summon.toJSON(),
                        request: {
                            type: 'GET',
                            url: req.protocol + '://' + req.get('host') + '/summon/' + summon._id,
                        }
                    }
                })
            };
            res.status(200).json(response);
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.post('/', (req, res, next) => {
    const summon = new Summon({
        _id: new mongoose.Types.ObjectId,
        uncap: req.body.uncap,
        level: req.body.level,
        baseSummon: req.body.baseSummon,
        active: true
    });
    summon.save().then(result => {
        const response = {
            message: 'Created summon successfully.',
            request: {
                type: 'GET',
                url: req.protocol + '://' + req.get('host') + '/´summon/' + result._id,
            }
        };
        res.status(201).json(response);
    }).catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});

router.get('/:summonId', (req, res, next) => {
    const id = req.params.summonId;
    Summon.findById(id)
        .select('-__v')
        .exec()
        .then(result => {
            console.log(result);
            if (result) {
                res.status(200).json(result);
            } else {
                res.status(404).json({
                    message: 'No valid entry for provided ID.'
                });
            }
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.patch('/:summonId', (req, res, next) => {
    const id = req.params.summonId;
    const updateOps = {};
    const keys = Object.keys(req.body);
    for (const key of keys) {
        updateOps[key] = req.body[key];
    }
    Summon.update({
            _id: id
        }, {
            $set: updateOps
        }).exec()
        .then(result => {
            const response = {
                message: 'Summon updated.',
                request: {
                    type: 'GET',
                    url: req.protocol + '://' + req.get('host') + '/summon/' + id,
                }
            };
            res.status(200).json(response);
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.delete('/:summonId', (req, res, next) => {
    const id = req.params.summonId;
    Summon.remove({
            _id: id
        }).exec()
        .then(result => {
            console.log(result);
            res.status(200).json(result);
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;