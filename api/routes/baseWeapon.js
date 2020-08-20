const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const BaseWeapon = require('../models/baseWeapon');
const Element = require('../models/element');
const Rarity = require('../models/rarity');
const WeaponType = require('../models/weaponType');

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

//TODO: avoid promise nesting
router.post('/', (req, res, next) => {
    Element.findById(req.body.elementId)
        .exec()
        .then(element => {
            WeaponType.findById(req.body.weaponTypeId)
                .exec()
                .then(weaponType => {
                    Rarity.findById(req.body.rarityId)
                        .exec()
                        .then(rarity => {
                            const baseWeapon = new BaseWeapon({
                                _id: new mongoose.Types.ObjectId(),
                                name: req.body.name,
                                maxUncap: req.body.maxUncap,
                                imgUrl: req.body.imgUrl,
                                usesSkillLevel: req.body.usesSkillLevel,
                                element: req.body.elementId,
                                weaponType: req.body.weaponTypeId,
                                rarity: req.body.rarityId
                            });
                            baseWeapon.save()
                                .then(result => {
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
                        }).catch(err => {
                            res.status(500).json({
                                message: 'Rarity not found.',
                                error: err
                            });
                        });
                }).catch(err => {
                    res.status(500).json({
                        message: 'Weapon type not found.',
                        error: err
                    });
                });
        }).catch(err => {
            res.status(500).json({
                message: 'Element not found.',
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
            if (result) {
                const response = {
                    baseWeapon: {
                        ...result.toJSON()
                    }
                };
                res.status(200).json(response);
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
    const keys = Object.keys(req.body);
    for (const key of keys) {
        updateOps[key] = req.body[key];
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