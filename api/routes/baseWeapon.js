const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const BaseWeapon = require('../models/baseWeapon');

router.get('/', (req, res, next) => {
    BaseWeapon.find()
        .select('-__v')
        .exec()
        .then(result => {
            const response = {
                count: result.length,
                baseWeapons: result.map(baseWeapon => {
                    return {
                        ...baseWeapon.toJSON(),
                        request: {
                            type: 'GET',
                            url: req.protocol + '://' + req.get('host') + '/baseWeapon/' + baseWeapon._id,
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
    const baseWeapon = new BaseWeapon({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        maxUncap: req.body.maxUncap,
        imgUrl: req.body.imgUrl,
        usesSkillLevel: req.body.usesSkillLevel,
        element: req.body.element,
        weaponType: req.body.weaponType,
        rarity: req.body.rarity
    });
    baseWeapon.save().then(result => {
        const response = {
            message: 'Create base weapon successfully.',
            baseWeapon: {
                ...result.toJSON(),
                request: {
                    type: 'GET',
                    url: req.protocol + '://' + req.get('host') + '/baseWeapon/' + result._id,
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

router.get('/:baseWeaponId', (req, res, next) => {
    const id = req.params.baseWeaponId;
    BaseWeapon.findById(id)
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

router.patch('/:baseWeaponId', (req, res, next) => {
    const id = req.params.baseWeaponId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    BaseWeapon.update({
            _id: id
        }, {
            $set: updateOps
        }).exec()
        .then(result => {
            const response = {
                message: 'Base weapon updated.',
                request: {
                    type: 'GET',
                    url: req.protocol + '://' + req.get('host') + '/baseWeapon/' + id,
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

router.delete('/:baseWeaponId', (req, res, next) => {
    const id = req.params.baseWeaponId;
    BaseWeapon.remove({
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