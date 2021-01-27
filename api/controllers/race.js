const mongoose = require('mongoose');
const Race = require('../models/race');

exports.race_getAll = (req, res, next) => {
    Race.find()
        .select('-__v')
        .lean()
        .exec()
        .then(result => {
            const response = {
                count: result.length,
                races: result.map(race => {
                    return {
                        race,
                        request: {
                            type: 'GET',
                            url: req.protocol + '://' + req.get('host') + '/race/' + race._id,
                        }
                    }
                })
            };
            res.status(200).json(response);
        }).catch(err => {
            res.status(500).json({
                error: err
            });
        });
}

exports.race_create = (req, res, next) => {
    const race = new Race({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name
    });
    race.save()
        .then(result => {
            const response = {
                message: 'Created race successfully.',
                race: {
                    ...race.toJSON(),
                    request: {
                        type: 'GET',
                        url: req.protocol + '://' + req.get('host') + '/race/' + result._id,
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

exports.race_getRace = (req, res, next) => {
    const id = req.params.raceId;
    Race.findById(id)
        .select('-__v')
        .lean()
        .exec()
        .then(result => {
            if (result) {
                const response = {
                    race: {
                        ...result.toJSON()
                    }
                };
                res.status(200).json(response);
            } else {
                res.status(404).json({
                    message: 'Race not found.'
                });
            }
        }).catch(err => {
            res.status(500).json({
                error: err
            });
        });
}

exports.race_edit = (req, res, next) => {
    const id = req.params.raceId;
    const updateOps = {};
    const keys = Object.keys(req.body);
    for (const key of keys) {
        updateOps[key] = req.body[key];
    }
    Race.update({
            _id: id
        }, {
            $set: updateOps
        }).exec()
        .then(result => {
            const response = {
                message: 'Race updated.',
                request: {
                    type: 'GET',
                    url: req.protocol + '://' + req.get('host') + '/race/' + id,
                }
            };
            res.status(200).json(response);
        }).catch(err => {
            res.status(500).json({
                error: err
            });
        });
}

exports.race_delete = (req, res, next) => {
    const id = req.params.raceId;
    Race.remove({
            _id: id
        }).exec()
        .then(result => {
            res.status(200).json({
                message: "Race deleted.",
                request: {
                    type: 'GET',
                    url: req.protocol + '://' + req.get('host') + '/race/',
                }
            });
        }).catch(err => {
            res.status(500).json({
                error: err
            });
        });
}