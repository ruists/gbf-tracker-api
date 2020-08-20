const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const WeaponType = require('../models/weaponType');

router.get('/', (req, res, next) => {
    WeaponType.find()
        .select('-__v')
        .exec()
        .then(result => {
            const response = {
                count: result.length,
                weaponTypes: result.map(weaponType => {
                    return {
                        ...weaponType.toJSON(),
                        request: {
                            type: 'GET',
                            url: req.protocol + '://' + req.get('host') + '/weaponType/' + weaponType._id,
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
    const weaponType = new WeaponType({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name
    });
    weaponType.save()
        .then(result => {
            const response = {
                message: 'Created weapon type successfully.',
                weaponType: {
                    ...result.toJSON(),
                    request: {
                        type: 'GET',
                        url: req.protocol + '://' + req.get('host') + '/weaponType/' + result._id,
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

router.get('/:weaponTypeId', (req, res, next) => {
    const id = req.params.weaponTypeId;
    WeaponType.findById(id)
        .select('-__v')
        .exec()
        .then(result => {
            if (result) {
                const response = {
                    weaponType: {
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
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.patch('/:weaponTypeId', (req, res, next) => {
    const id = req.params.weaponTypeId;
    const updateOps = {};
    const keys = Object.keys(req.body);
    for (const key of keys) {
        updateOps[key] = req.body[key];
    }
    WeaponType.update({
            _id: id
        }, {
            $set: updateOps
        }).exec()
        .then(result => {
            const response = {
                message: 'Weapon type updated.',
                request: {
                    type: 'GET',
                    url: req.protocol + '://' + req.get('host') + '/weaponType/' + id,
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

router.delete('/:weaponTypeId', (req, res, next) => {
    const id = req.params.weaponTypeId;
    WeaponType.remove({
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