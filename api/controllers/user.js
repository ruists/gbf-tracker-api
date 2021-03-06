const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Role = require("../models/role");

exports.user_create = (req, res, next) => {
  User.find({
    email: req.body.email
  })
    .lean()
    .exec()
    .then((user) => {
      if (user.length >= 1) {
        //user found
        return res.status(409).json({
          message: "User already exists."
        });
      }
      return Role.findOne({
        name: "User"
      }).exec();
    })
    .then((role) => {
      if (res.statusCode === 409) {
        return res;
      }
      if (!role) {
        return res.status(500).json({
          message: "An error occurred while creating the new account."
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash,
              role: role._id
            });
            return user.save();
          }
        });
      }
    })
    .then((result) => {
      if (res.statusCode === 409 || res.statusCode === 500) {
        return res;
      }
      res.status(201).json({
        message: "User created."
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err
      });
    });
};

exports.user_createAdmin = (req, res, next) => {
  User.find({
    email: req.body.email
  })
    .lean()
    .exec()
    .then((user) => {
      if (user.length >= 1) {
        //user found
        return res.status(409).json({
          message: "User already exists."
        });
      }
      return Role.findOne({
        name: "User"
      }).exec();
    })
    .then((role) => {
      if (res.statusCode === 409) {
        return res;
      }
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
          return res.status(500).json({
            error: err
          });
        } else {
          const user = new User({
            _id: new mongoose.Types.ObjectId(),
            email: req.body.email,
            password: hash,
            role: role._id
          });
          user
            .save()
            .then((result) => {
              res.status(201).json({
                message: "Admin created."
              });
            })
            .catch((err) => {
              res.status(500).json({
                error: err
              });
            });
        }
      });
    });
};

exports.user_login = (req, res, next) => {
  User.find({
    email: req.body.email
  })
    .exec()
    .then((result) => {
      if (result.length < 1) {
        return res.status(401).json({
          message: "Authentication failed."
        });
      }

      //user exists
      bcrypt.compare(req.body.password, result[0].password, (err, equal) => {
        if (err) {
          res.status(401).json({
            message: "Authentication failed."
          });
        }
        if (equal) {
          const token = jwt.sign(
            {
              email: result[0].email,
              userId: result[0]._id
            },
            process.env.JWT_KEY,
            {
              expiresIn: "1h"
            }
          );
          res.status(200).json({
            message: "Authentication successful.",
            user: {
              name: req.body.email,
              token: token
            }
          });
        } else {
          res.status(401).json({
            message: "Authentication failed."
          });
        }
      });
    })
    .catch((err) => {
      return res.status(401).json({
        message: "Authentication failed."
      });
    });
};

exports.user_delete = (req, res, next) => {
  User.remove({
    _id: req.params.userId
  })
    .exec()
    .then((result) => {
      if (result.deletedCount) {
        res.status(200).json({
          message: "User deleted."
        });
      } else {
        res.status(404).json({
          message: "User not found."
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: err
      });
    });
};
