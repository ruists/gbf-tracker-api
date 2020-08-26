const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');

const Weapon = require('../models/weapon');
const BaseWeapon = require('../models/baseWeapon');

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

router.post('/', checkAuth, (req, res, next) => {
    BaseWeapon.findById(req.body.baseWeaponId)
        .exec()
        .then(baseWeapon => {
            if (!baseWeapon) {
                return res.status(500).json({
                    message: 'Base weapon not found.'
                });
            }
            const weapon = new Weapon({
                _id: new mongoose.Types.ObjectId(),
                uncap: req.body.uncap,
                level: req.body.level,
                skillLevel: req.body.skillLevel,
                baseWeapon = baseWeapon._id
            });
            return weapon.save();
        }).then(result => {
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
            if (result) {
                const response = {
                    weapon: {
                        ...result.toJSON()
                    }
                };
                res.status(200).json(response);
            } else {
                res.status(404).json({
                    message: 'Weapon not found.'
                });
            }
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

//TODO: TEST
router.patch('/:weaponId', checkAuth, (req, res, next) => {
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
            res.status(200).json(result);
        }).catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;