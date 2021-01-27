const mongoose = require('mongoose');
const Role = require('../models/role');

exports.role_getAll = (req, res, next) => {
    Role.find()
        .select('-__v')
        .lean()
        .exec()
        .then(result => {
            const response = {
                count: result.length,
                roles: result.map(role => {
                    return {
                        role,
                        request: {
                            type: 'GET',
                            url: req.protocol + '://' + req.get('host') + '/role/' + role._id,
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

exports.role_create = (req, res, next) => {
    const role = new Role({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name
    });
    return role.save()
        .then(result => {
            const response = {
                message: 'Created role successfully.',
                role: {
                    ...result.toJSON()
                }
            };
            res.status(201).json(response);
        }).catch(err => {
            res.status(500).json({
                error: err
            });
        });
}