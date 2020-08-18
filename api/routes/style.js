const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

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
                            url: req.get('host') + '/style/' + style._id,
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
    const style = new Style({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name
    });
    style.save()
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

router.get('/:styleId', (req, res, next) => {
    const id = req.params.styleId;
    Style.findById(id).exec()
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

router.patch('/:styleId', (req, res, next) => {
    const id = req.params.styleId;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    Style.update({
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

router.delete('/:styleId', (req, res, next) => {
    const id = req.params.styleId;
    Style.remove({
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