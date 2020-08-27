const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');
const checkAdmin = require('../middleware/check-admin');

const BaseSummon = require('../models/baseSummon');
const Element = require('../models/element');
const Rarity = require('../models/rarity');

router.get('/', (req, res, next) => {
    BaseSummon.find()
        .select('-__v')
        .lean()
        .exec()
        .then(result => {
            const response = {
                count: result.length,
                baseSummons: result.map(baseSummon => {
                    return {
                        ...baseSummon.toJSON(),
                        request: {
                            type: 'GET',
                            url: req.protocol + '://' + req.get('host') + '/baseSummon/' + baseSummon._id,
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

//TODO: TEST
router.post('/', checkAuth, checkAdmin, (req, res, next) => {
    Element.findById(req.body.elementId).lean().exec()
        .then(element => {
            if (!element) {
                return res.status(500).json({
                    message: 'Element not found.'
                });
            }
            return Rarity.findById(req.body.rarityId).lean().exec();
        }).then(rarity => {
            if (res.statusCode === 500) {
                return res;
            }
            if (!rarity) {
                return res.status(500).json({
                    message: 'Rarity not found.'
                });
            }
            const baseSummon = new BaseSummon({
                _id: new mongoose.Types.ObjectId(),
                name: req.body.name,
                maxUncap: req.body.maxUncap,
                imgUrl: req.body.imgUrl,
                element: req.body.elementId,
                rarity: req.body.rarityId
            });

            return baseSummon.save();
        }).then(result => {
            if (res.statusCode === 500) {
                return res;
            }
            const response = {
                message: 'Created base summon successfully.',
                baseSummon: {
                    ...result.toJSON(),
                    request: {
                        type: 'GET',
                        url: req.protocol + '://' + req.get('host') + '/baseSummon/' + result._id,
                    }
                }
            };
            res.status(201).json(response);
        }).catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

router.get('/:baseSummonId', (req, res, next) => {
    const id = req.params.BaseSummonId;
    BaseSummon.findById(id)
        .select('-__v')
        .lean()
        .exec()
        .then(result => {
            if (result) {
                const response = {
                    baseSummon: {
                        ...result.toJSON()
                    }
                };
                res.status(200).json(response);
            } else {
                res.status(404).json({
                    message: 'Base summon not found.'
                });
            }
        }).catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

//TODO: TEST
router.patch('/:baseSummonId', checkAuth, checkAdmin, (req, res, next) => {
    const id = req.params.BaseSummonId;
    const updateOps = {};
    const keys = Object.keys(req.body);
    for (const key of keys) {
        updateOps[key] = req.body[key];
    }
    BaseSummon.update({
            _id: id
        }, {
            $set: updateOps
        }).exec()
        .then(result => {
            const response = {
                message: 'Base summon updated.',
                request: {
                    type: 'GET',
                    url: req.protocol + '://' + req.get('host') + '/baseSummon/' + id,
                }
            };
            res.status(200).json(result);
        }).catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

router.delete('/:baseSummonId', checkAuth, checkAdmin, (req, res, next) => {
    const id = req.params.BaseSummonId;
    BaseSummon.remove({
            _id: id
        }).exec()
        .then(result => {
            res.status(200).json({
                message: "Base summon deleted.",
                request: {
                    type: 'GET',
                    url: req.protocol + '://' + req.get('host') + '/baseSummon/',
                }
            });
        }).catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;