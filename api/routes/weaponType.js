const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const WeaponType = require('../models/weaponType');

router.get('/', (req, res, next) => {
    WeaponType.find()
        .select('-__v')
        .exec()
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

router.post('/', (req, res, next) => {
    const weaponType = new WeaponType({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name
    });
    weaponType.save()
        .then(result => {
            console.log(result);
            res.status(201).json(result);
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.get('/:weaponTypeId', (req, res, next) => {
    const id = req.params.weaponTypeId;
    WeaponType.findById(id).exec()
        .then(result => {
            console.log(result);
            if (result) {
                res.status(200).json(result);
            } else {
                res.status(404).json({
                    message: 'No valid entry found for provided ID.'
                });
            }
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.patch('/:weaponTypeId', (req, res, next) => {
    const id = req.params.weaponTypeId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    WeaponType.update({
            _id: id
        }, {
            $set: updateOps
        }).exec()
        .then(response => {
            console.log(response);
            res.status(200).json(response);
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.delete('/:weaponTypeId', (req, res, next) => {
    const id = req.params.weaponTypeId;
    WeaponType.remove({
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