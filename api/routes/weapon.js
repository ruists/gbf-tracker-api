const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Weapon = require('../models/weapon');

router.get('/', (req, res, next) => {
    Weapon.find()
        .select('-__v')
        .exec()
        .then(result => {
            const response = {
                count: result.length,
                weapons: result.map(weapon => {
                    return {
                        ...weapon.toJSON(),
                        request: {
                            type: 'GET',
                            url: req.protocol + '://' + req.get('host') + '/weapon/' + weapon._id,
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
    const weapon = new Weapon({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        level: req.body.level,
        uncap: req.body.uncap,
        element: req.body.element,
        rarity: req.body.rarity,
        style: req.body.style,
        weaponType: req.body.weaponType
    });
    weapon.save().then(result => {
        const response = {
            message: 'Created weapon successfully.',
            weapon: {
                ...result.toJSON(),
                request: {
                    type: 'GET',
                    url: req.protocol + '://' + req.get('host') + '/weapon/' + result._id,
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

router.get('/:weaponId', (req, res, next) => {
    const id = req.params.weaponId;
    Weapon.findById(id)
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

router.patch('/:weaponId', (req, res, next) => {
    const id = req.params.weaponId;
    const updateOps = {};
    const keys = Object.keys(req.body);
    for (const key of keys) {
        updateOps[key] = req.body[key];
    }
    Weapon.update({
            _id: id
        }, {
            $set: updateOps
        }).exec()
        .then(result => {
            const response = {
                message: 'Weapon updated.',
                request: {
                    type: 'GET',
                    url: req.protocol + '://' + req.get('host') + '/weapon/' + id,
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

router.delete('/:weaponId', (req, res, next) => {
    const id = req.params.weaponId;
    Weapon.remove({
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