const mongoose = require('mongoose');
const BaseWeapon = require('../models/baseWeapon');
const Element = require('../models/element');
const Rarity = require('../models/rarity');
const WeaponType = require('../models/weaponType');

exports.baseWeapon_getAll = (req, res, next) => {
    BaseWeapon.find()
        .select('-__v')
        .lean()
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
}

exports.baseWeapon_create = (req, res, next) => {
    Element.findById(req.body.elementId).lean().exec()
        .then(element => {
            if (!element) {
                return res.status(500).json({
                    message: 'Element not found.'
                });
            }

            return WeaponType.findById(req.body.weaponTypeId).lean().exec();
        }).then(weaponType => {
            if (res.statusCode === 500) {
                return res;
            }
            if (!weaponType) {
                return res.status(500).json({
                    message: 'Weapon type not found.'
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
            return baseWeapon.save();
        }).then(result => {
            if (res.statusCode === 500) {
                return res;
            }
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
            res.status(500).json({
                error: err
            });
        });
}

exports.baseWeapon_getBaseWeapon = (req, res, next) => {
    const id = req.params.baseWeaponId;
    BaseWeapon.findById(id)
        .select('-__v')
        .lean()
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
                    message: 'Base weapon not found.'
                });
            }
        }).catch(err => {
            res.status(500).json({
                error: err
            });
        });
}

exports.baseWeapon_edit = (req, res, next) => {
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
            res.status(500).json({
                error: err
            });
        });
}

exports.baseWeapon_delete = (req, res, next) => {
    const id = req.params.baseWeaponId;
    BaseWeapon.remove({
            _id: id
        }).exec()
        .then(result => {
            res.status(200).json({
                message: "Base weapon deleted.",
                request: {
                    type: 'GET',
                    url: req.protocol + '://' + req.get('host') + '/baseWeapon/',
                }
            });
        }).catch(err => {
            res.status(500).json({
                error: err
            });
        });
}