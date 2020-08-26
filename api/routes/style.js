const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('../middleware/check-auth');

const Style = require('../models/style');

router.get('/', (req, res, next) => {
    Style.find()
        .select('-__v')
        .exec()
        .then(result => {
            const response = {
                count: result.length,
                styles: result.map(style => {
                    return {
                        ...style.toJSON(),
                        request: {
                            type: 'GET',
                            url: req.protocol + '://' + req.get('host') + '/style/' + style._id,
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
    const style = new Style({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name
    });
    style.save()
        .then(result => {
            const response = {
                message: 'Created style successfully.',
                request: {
                    type: 'GET',
                    url: req.protocol + '://' + req.get('host') + '/style/' + result._id,
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

router.get('/:styleId', (req, res, next) => {
    const id = req.params.styleId;
    Style.findById(id)
        .select('-__v')
        .exec()
        .then(result => {
            if (result) {
                const response = {
                    style: {
                        ...result.toJSON()
                    }
                };
                res.status(200).json(response);
            } else {
                res.status(404).json({
                    message: 'Style not found.'
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
router.patch('/:styleId', checkAuth, (req, res, next) => {
    const id = req.params.styleId;
    const updateOps = {};
    const keys = Object.keys(req.body);
    for (const key of keys) {
        updateOps[key] = req.body[key];
    }
    Style.update({
            _id: id
        }, {
            $set: updateOps
        }).exec()
        .then(result => {
            const response = {
                message: 'Style updated.',
                request: {
                    type: 'GET',
                    url: req.protocol + '://' + req.get('host') + '/style/' + id,
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

router.delete('/:styleId', checkAuth, (req, res, next) => {
    const id = req.params.styleId;
    Style.remove({
            _id: id
        }).exec()
        .then(result => {
            res.status(200).json({
                message: "Style deleted.",
                request: {
                    type: 'GET',
                    url: req.protocol + '://' + req.get('host') + '/style/',
                }
            });
        }).catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;