const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Character = require('../models/character');

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
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

//TODO: check if required objects already exist
router.post('/', (req, res, next) => {
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
    character.save().then(result => {
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
        console.log(err);
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

router.patch('/:characterId', (req, res, next) => {
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
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.delete('/:characterId', (req, res, next) => {
    const id = req.params.characterId;
    Character.remove({
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