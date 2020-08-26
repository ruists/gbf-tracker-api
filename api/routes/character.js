const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');

const Character = require('../models/character');
const Element = require('../models/element');
const Rarity = require('../models/rarity');
const Style = require('../models/style');
const WeaponType = require('../models/weaponType');

router.get('/', (req, res, next) => {
    Character.find()
        .select('-__v')
        .exec()
        .then(result => {
            const response = {
                count: result.length,
                characters: result.map(character => {
                    return {
                        ...character.toJSON(),
                        request: {
                            type: 'GET',
                            url: req.protocol + '://' + req.get('host') + '/character/' + character._id,
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

            const character = new Character({
                _id: new mongoose.Types.ObjectId(),
                name: req.body.name,
                level: req.body.level,
                uncap: req.body.uncap,
                element: req.body.elementId,
                rarity: req.body.rarityId,
                style: req.body.styleId,
                weaponType: req.body.weaponTypeId
            });
            return character.save();
        }).then(result => {
            const response = {
                message: 'Created character successfully',
                character: {
                    ...result.toJSON(),
                    request: {
                        type: 'GET',
                        url: req.protocol + '://' + req.get('host') + '/character/' + result._id,
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

router.get('/:characterId', (req, res, next) => {
    const id = req.params.characterId;
    Character.findById(id)
        .select('-__v')
        .exec()
        .then(result => {
            if (result) {
                const response = {
                    character: {
                        ...result.toJSON()
                    }
                };
                res.status(200).json(response);
            } else {
                res.status(404).json({
                    message: 'Character not found.'
                });
            }
        }).catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

//TODO: TEST
router.patch('/:characterId', checkAuth, (req, res, next) => {
    const id = req.params.characterId;
    const updateOps = {};
    const keys = Object.keys(req.body);
    for (const key of keys) {
        updateOps[key] = req.body[key];
    }
    Character.update({
            _id: id
        }, {
            $set: updateOps
        }).exec()
        .then(result => {
            const response = {
                message: 'Character updated.',
                request: {
                    type: 'GET',
                    url: req.protocol + '://' + req.get('host') + '/character/' + id,
                }
            };
            res.status(200).json(response);
        }).catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

router.delete('/:characterId', checkAuth, (req, res, next) => {
    const id = req.params.characterId;
    Character.remove({
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