const mongoose = require('mongoose');

const Element = require('../models/element');


exports.element_getAll = (req, res, next) => {
    Element.find()
        .select('-__v')
        .lean()
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
}

exports.element_create = (req, res, next) => {
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
            res.status(500).json({
                error: err
            });
        });
}

exports.element_getElement = (req, res, next) => {
    const id = req.params.elementId;
    Element.findById(id)
        .select('-__v')
        .lean()
        .exec()
        .then(result => {
            if (result) {
                const response = {
                    element: {
                        ...result.toJSON()
                    }
                };
                res.status(200).json(response);
            } else {
                res.status(404).json({
                    message: 'Element not found.'
                });
            }
        }).catch(err => {
            res.status(500).json({
                error: err
            });
        });
}

exports.element_edit = (req, res, next) => {
    const id = req.params.elementId;
    const updateOps = {};
    const keys = Object.keys(req.body);
    for (const key of keys) {
        updateOps[key] = req.body[key];
    }
    Element.update({
            _id: id
        }, {
            $set: updateOps
        }).exec()
        .then(result => {
            const response = {
                message: 'Element updated.',
                request: {
                    type: 'GET',
                    url: req.protocol + '://' + req.get('host') + '/element/' + id,
                }
            };
            res.status(200).json(response);
        }).catch(err => {
            res.status(500).json({
                error: err
            });
        });
}

exports.element_delete = (req, res, next) => {
    const id = req.params.elementId;
    Element.remove({
            _id: id
        }).exec()
        .then(result => {
            res.status(200).json({
                message: "Element deleted.",
                request: {
                    type: 'GET',
                    url: req.protocol + '://' + req.get('host') + '/element/',
                }
            });
        }).catch(err => {
            res.status(500).json({
                error: err
            });
        });
}