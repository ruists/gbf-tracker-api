const mongoose = require("mongoose");
const Weapon = require("../models/weapon");
const BaseWeapon = require("../models/baseWeapon");

exports.weapon_getAll = (req, res, next) => {
  const userId = req.userData.userId;
  Weapon.find({
    user: userId
  })
    .select("-__v")
    .lean({ autopopulate: true })
    .exec()
    .then((result) => {
      const response = {
        count: result.length,
        weapons: result.map((weapon) => {
          return {
            weapon,
            request: {
              type: "GET",
              url:
                req.protocol + "://" + req.get("host") + "/weapon/" + weapon._id
            }
          };
        })
      };
      res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.weapon_create = (req, res, next) => {
  BaseWeapon.findById(req.body.baseWeaponId)
    .lean()
    .exec()
    .then((baseWeapon) => {
      if (!baseWeapon) {
        return res.status(500).json({
          message: "Base weapon not found."
        });
      }
      const weapon = new Weapon({
        _id: new mongoose.Types.ObjectId(),
        uncap: req.body.uncap,
        level: req.body.level,
        skillLevel: req.body.skillLevel,
        baseWeapon: baseWeapon._id
      });
      return weapon.save();
    })
    .then((result) => {
      if (res.statusCode === 500) {
        return res;
      }
      const response = {
        message: "Created weapon successfully.",
        weapon: {
          ...result.toJSON(),
          request: {
            type: "GET",
            url:
              req.protocol + "://" + req.get("host") + "/weapon/" + result._id
          }
        }
      };
      res.status(201).json(response);
    })
    .catch((err) => {
      res.status(500).json({
        error: err
      });
    });
};

exports.weapon_getWeapon = (req, res, next) => {
  const id = req.params.weaponId;
  const userId = req.userData.userId;
  Weapon.findById(id)
    .select("-__v")
    .lean({ autopopulate: true })
    .exec()
    .then((result) => {
      if (result) {
        if (result.user !== userId) {
          res.status(403).json({
            message: "Unauthorized access to resource."
          });
        } else {
          const response = {
            weapon: {
              result
            }
          };
          res.status(200).json(response);
        }
      } else {
        res.status(404).json({
          message: "Weapon not found."
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.weapon_edit = (req, res, next) => {
  const id = req.params.weaponId;
  const updateOps = {};
  const keys = Object.keys(req.body);
  for (const key of keys) {
    updateOps[key] = req.body[key];
  }
  Weapon.update(
    {
      _id: id
    },
    {
      $set: updateOps
    }
  )
    .exec()
    .then((result) => {
      const response = {
        message: "Weapon updated.",
        request: {
          type: "GET",
          url: req.protocol + "://" + req.get("host") + "/weapon/" + id
        }
      };
      res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.weapon_delete = (req, res, next) => {
  const id = req.params.weaponId;
  Weapon.remove({
    _id: id
  })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Weapon deleted.",
        request: {
          type: "GET",
          url: req.protocol + "://" + req.get("host") + "/weapon/"
        }
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err
      });
    });
};
