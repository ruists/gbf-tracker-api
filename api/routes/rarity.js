const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Rarity = require('../models/rarity');

router.get('/', (req, res, next) => {
    Rarity.find()
        .select('-__v')
        .exec()
        .then(result => {
            const response = {
                count: result.length,
                rarities: result.map(rarity => {
                    return {
                        ...rarity.toJSON(),
                        request: {
                            type: 'GET',
                            url: req.protocol + '://' + req.get('host') + '/rarity/' + rarity._id,
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
    const rarity = new Rarity({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name
    });
    rarity.save()
        .then(result => {
            const response = {
                message: 'Created rarity successfully.',
                rarity: {
                    ...result.toJSON(),
                    request: {
                        type: 'GET',
                        url: req.protocol + '://' + req.get('host') + '/rarity/' + result._id,
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

router.get('/:rarityId', (req, res, next) => {
    const id = req.params.rarityId;
    Rarity.findById(id)
        .select('-__v')
        .exec()
        .then(result => {
            if (result) {
                const response = {
                    rarity: {
                        ...result.toJSON()
                    }
                };
                res.status(200).json(response);
            } else {
                res.status(404).json({
                    message: 'No valid entry found for provided ID.'
                });
            }
        }).catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

//TODO: TEST
router.patch('/:rarityId', (req, res, next) => {
    const id = req.params.rarityId;
    const updateOps = {};
    const keys = Object.keys(req.body);
    for (const key of keys) {
        updateOps[key] = req.body[key];
    }
    Rarity.update({
            _id: id
        }, {
            $set: updateOps
        }).exec()
        .then(result => {
            const response = {
                message: 'Rarity updated.',
                request: {
                    type: 'GET',
                    url: req.protocol + '://' + req.get('host') + '/rarity/' + id,
                }
            };
            res.status(200).json(response);
        }).catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

router.delete('/:rarityId', (req, res, next) => {
    const id = req.params.rarityId;
    Rarity.remove({
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