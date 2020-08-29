const mongoose = require('mongoose');
const WeaponType = require('../models/weaponType');

exports.weaponType_getAll = (req, res, next) => {
    WeaponType.find()
        .select('-__v')
        .lean()
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
}

exports.weaponType_create = (req, res, next) => {
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
}

exports.weaponType_getWeaponType = (req, res, next) => {
    const id = req.params.weaponTypeId;
    WeaponType.findById(id)
        .select('-__v')
        .lean()
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
                    message: 'Weapon type not found.'
                });
            }
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}

exports.weaponType_edit = (req, res, next) => {
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
}

exports.weaponType_delete = (req, res, next) => {
    const id = req.params.weaponTypeId;
    WeaponType.remove({
            _id: id
        }).exec()
        .then(result => {
            console.log(result);
            res.status(200).json({
                message: "Weapon type deleted.",
                request: {
                    type: 'GET',
                    url: req.protocol + '://' + req.get('host') + '/weaponType/',
                }
            });
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
}