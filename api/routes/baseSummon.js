const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const BaseSummon = require('../models/baseSummon');

router.get('/', (req, res, next) => {
    BaseSummon.find()
        .select('-__v')
        .exec()
        .then(result => {
            const response = {
                count: result.length,
                baseSummons: result.map(baseSummon => {
                    return {
                        ...baseSummon.toJSON(),
                        request: {
                            type: 'GET',
                            url: req.get('host') + '/baseSummon/' + baseSummon._id,
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
    const baseSummon = new BaseSummon({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        maxUncap: req.body.maxUncap,
        imgUrl: req.body.imgUrl,
        element: req.body.element,
        rarity: req.body.rarity
    });

    baseSummon.save()
        .then(result => {
            const response = {
                message: 'Created base summon successfully.',
                baseSummon: {
                    ...result.toJSON(),
                    request: {
                        type: 'GET',
                        url: req.get('host') + '/baseSummon/' + result._id,
                    }
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

router.get('/:baseSummonId', (req, res, next) => {
    const id = req.params.BaseSummonId;
    BaseSummon.findById(id).exec()
        .then(result => {
            if (result) {
                res.status(200).json(result);
            } else {
                res.status(404).json({
                    message: 'No valid entry found for provided ID.'
                });
            }
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.patch('/:baseSummonId', (req, res, next) => {
    const id = req.params.BaseSummonId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    BaseSummon.update({
            _id: id
        }, {
            $set: updateOps
        }).exec()
        .then(result => {
            res.status(200).json(result);
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.delete('/:baseSummonId', (req, res, next) => {
    const id = req.params.BaseSummonId;
    BaseSummon.remove({
            _id: id
        }).exec()
        .then(result => {
            res.status(200).json(result);
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;