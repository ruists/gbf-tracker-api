const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');

const Summon = require('../models/summon');
const BaseSummon = require('../models/baseSummon');

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

//TODO: TEST
router.post('/', checkAuth, (req, res, next) => {
    BaseSummon.findById(req.body.baseSummonId)
        .exec()
        .then(baseSummon => {
            if (!baseSummon) {
                return res.status(500).json({
                    message: 'Base summon not found.'
                });
            }
            const summon = new Summon({
                _id: new mongoose.Types.ObjectId,
                uncap: req.body.uncap,
                level: req.body.level,
                baseSummon: baseSummon._id,
                active: true
            });
            return summon.save();
        }).then(result => {
            const response = {
                message: 'Created summon successfully.',
                request: {
                    type: 'GET',
                    url: req.protocol + '://' + req.get('host') + '/´summon/' + result._id,
                }
            };
            res.status(201).json(response);
        }).catch(err => {
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
            if (result) {
                const response = {
                    summon: {
                        ...result.toJSON()
                    }
                };
                res.status(200).json(response);
            } else {
                res.status(404).json({
                    message: 'Summon not found.'
                });
            }
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

//TODO: TEST
router.patch('/:summonId', checkAuth, (req, res, next) => {
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

router.delete('/:summonId', checkAuth, (req, res, next) => {
    const id = req.params.summonId;
    Summon.remove({
            _id: id
        }).exec()
        .then(result => {
            res.status(200).json(result);
        }).catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;