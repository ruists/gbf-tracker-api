const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Element = require('../models/element');

router.get('/', (req, res, next) => {
    Element.find()
        .select('-__v')
        .exec()
        .then(result => {
            const response = {
                count: result.length,
                elements: result.map(element => {
                    return {
                        ...element.toJSON(),
                        request: {
                            type: 'GET',
                            url: req.protocol + '://' + req.get('host') + '/element/' + element._id
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
    const element = new Element({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name
    });
    element.save()
        .then(result => {
            const response = {
                message: 'Created element successfully.',
                element: {
                    ...result.toJSON,
                    request: {
                        type: 'GET',
                        url: req.protocol + '://' + req.get('host') + '/element/' + result._id,
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

router.get('/:elementId', (req, res, next) => {
    const id = req.params.elementId;
    Element.findById(id).exec()
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

router.patch('/:elementId', (req, res, next) => {
    const id = req.params.elementId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Element.update({
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

router.delete('/:elementId', (req, res, next) => {
    const id = req.params.elementId;
    Element.remove({
            _id: id
        }).exec()
        .then(result => {
            res.status(200).json(result);
        }).catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;