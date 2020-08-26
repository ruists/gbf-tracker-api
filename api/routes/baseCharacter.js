const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');

const BaseCharacter = require('../models/baseCharacter');
const Element = require('../models/element');
const Rarity = require('../models/rarity');
const Style = require('../models/style');
const WeaponType = require('../models/weaponType');

router.get('/', (req, res, next) => {
    BaseCharacter.find()
        .select('-__v')
        .exec()
        .then(result => {
            const response = {
                count: result.length,
                baseCharacters: result.map(bCharacter => {
                    return {
                        ...bCharacter.toJSON(),
                        request: {
                            type: 'GET',
                            url: req.protocol + '://' + req.get('host') + '/baseCharacter/' + character._id,
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

//TODO: Consider characters that have 2 weapon types
router.post('/', checkAuth, (req, res, next) => {
    Element.findById(req.body.elementId).exec()
        .then(element => {
            if (!element) {
                return res.status(500).json({
                    message: 'Element not found.'
                });
            }
            return Rarity.findById(req.body.rarityId).exec();
        }).then(rarity => {
            if (!rarity) {
                return res.status(500).json({
                    message: 'Rarity not found.'
                });
            }
            return Style.findById(req.body.styleId).exec();
        }).then(style => {
            if (!style) {
                return res.status(500).json({
                    message: 'Style not found.'
                });
            }
            return WeaponType.findById(req.body.weaponTypeId).exec();
        }).then(weaponType => {
            if (!weaponType) {
                return res.status(500).json({
                    message: 'Weapon type not found.'
                });
            }

            const bCharacter = new BaseCharacter({
                _id: new mongoose.Types.ObjectId(),
                name: req.body.name,
                maxUncap: req.body.maxUncap,
                element: req.body.elementId,
                rarity: req.body.rarityId,
                style: req.body.styleId,
                weaponType: req.body.weaponTypeId
            });
            return bCharacter.save();
        }).then(result => {
            const response = {
                message: 'Created base character successfully',
                baseCharacter: {
                    ...result.toJSON(),
                    request: {
                        type: 'GET',
                        url: req.protocol + '://' + req.get('host') + '/baseCharacter/' + result._id,
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

router.get('/:baseCharacterId', (req, res, next) => {
    const id = req.params.baseCharacterId;
    BaseCharacter.findById(id)
        .select('-__v')
        .exec()
        .then(result => {
            if (result) {
                const response = {
                    baseCharacter: {
                        ...result.toJSON()
                    }
                };
                res.status(200).json(response);
            } else {
                res.status(404).json({
                    message: 'Base character not found.'
                });
            }
        }).catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

//TODO: TEST
router.patch('/:baseCharacterId', checkAuth, (req, res, next) => {
    const id = req.params.baseCharacterId;
    const updateOps = {};
    const keys = Object.keys(req.body);
    for (const key of keys) {
        updateOps[key] = req.body[key];
    }
    BaseCharacter.update({
            _id: id
        }, {
            $set: updateOps
        }).exec()
        .then(result => {
            const response = {
                message: 'Base character updated.',
                request: {
                    type: 'GET',
                    url: req.protocol + '://' + req.get('host') + '/baseCharacter/' + id,
                }
            };
            res.status(200).json(response);
        }).catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

router.delete('/:baseCharacterId', checkAuth, (req, res, next) => {
    const id = req.params.baseCharacterId;
    BaseCharacter.remove({
            _id: id
        }).exec()
        .then(result => {
            res.status(200).json({
                message: "Base character deleted.",
                request: {
                    type: 'GET',
                    url: req.protocol + '://' + req.get('host') + '/baseCharacter/',
                }
            });
        }).catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;