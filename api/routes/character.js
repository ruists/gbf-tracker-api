const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');

const Character = require('../models/character');
const BaseCharacter = require('../models/baseCharacter');

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
                    };
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
    BaseCharacter.findById(req.body.baseCharacterId).exec()
        .then(baseCharacter => {
            if (!baseCharacter) {
                return res.status(500).json({
                    message: 'Base character not found.'
                });
            }

            const character = new Character({
                _id: new mongoose.Types.ObjectId(),
                level: req.body.level,
                uncap: req.body.uncap,
                baseCharacter: baseCharacter._id
            });
            return character.save();
        }).then(result => {
            if (res.statusCode === 500) {
                return res;
            }
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
            res.status(200).json({
                message: "Character deleted.",
                request: {
                    type: 'GET',
                    url: req.protocol + '://' + req.get('host') + '/character/',
                }
            });
        }).catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;