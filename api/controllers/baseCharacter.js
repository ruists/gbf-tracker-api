const mongoose = require("mongoose");
const BaseCharacter = require("../models/baseCharacter");
const Element = require("../models/element");
const Rarity = require("../models/rarity");
const Race = require("../models/race");
const Style = require("../models/style");
const WeaponType = require("../models/weaponType");

exports.baseCharacter_getAll = (req, res, next) => {
  BaseCharacter.find()
    .select("-__v")
    .lean({ autopopulate: true })
    .exec()
    .then((result) => {
      const response = {
        count: result.length,
        baseCharacters: result.map((baseCharacter) => {
          return {
            baseCharacter,
            request: {
              type: "GET",
              url:
                req.protocol +
                "://" +
                req.get("host") +
                "/baseCharacter/" +
                baseCharacter._id
            }
          };
        })
      };
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json({
        error: err
      });
    });
};

exports.baseCharacter_create = (req, res, next) => {
  Element.findById(req.body.elementId)
    .lean()
    .exec()
    .then((element) => {
      if (!element) {
        return res.status(500).json({
          message: "Element not found."
        });
      }
      return Race.findById(req.body.raceId).lean().exec();
    })
    .then((race) => {
      if (res.statusCode === 500) {
        return res;
      }
      if (!race) {
        return res.status(500).json({
          message: "Race not found."
        });
      }
      return Rarity.findById(req.body.rarityId).lean().exec();
    })
    .then((rarity) => {
      if (res.statusCode === 500) {
        return res;
      }
      if (!rarity) {
        return res.status(500).json({
          message: "Rarity not found."
        });
      }
      return Style.findById(req.body.styleId).lean().exec();
    })
    .then((style) => {
      if (res.statusCode === 500) {
        return res;
      }
      if (!style) {
        return res.status(500).json({
          message: "Style not found."
        });
      }
      const weaponTypeSearches = [];
      for (const typeId of req.body.weaponTypeId) {
        weaponTypeSearches.push(WeaponType.findById(typeId).lean().exec());
      }
      return Promise.all(weaponTypeSearches);
    })
    .then((weaponTypes) => {
      if (res.statusCode === 500) {
        return res;
      }
      if (weaponTypes.length > 1) {
        //multiple weapon types
        for (const type of weaponTypes) {
          if (!type) {
            return res.status(500).json({
              message: "One or more weapon types not found."
            });
          }
        }
      } else if (!weaponTypes[0]) {
        return res.status(500).json({
          message: "Weapon type not found."
        });
      }

      const bCharacter = new BaseCharacter({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        maxUncap: req.body.maxUncap,
        imgUrl: req.body.imgUrl,
        element: req.body.elementId,
        rarity: req.body.rarityId,
        style: req.body.styleId,
        race: req.body.raceId,
        weaponType: req.body.weaponTypeId
      });
      return bCharacter.save();
    })
    .then((result) => {
      if (res.statusCode === 500) {
        return res;
      }
      const response = {
        message: "Created base character successfully",
        baseCharacter: {
          ...result.toJSON(),
          request: {
            type: "GET",
            url:
              req.protocol +
              "://" +
              req.get("host") +
              "/baseCharacter/" +
              result._id
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

exports.baseCharacter_getBaseCharacter = (req, res, next) => {
  const id = req.params.baseCharacterId;
  BaseCharacter.findById(id)
    .select("-__v")
    .lean({ autopopulate: true })
    .exec()
    .then((result) => {
      if (result) {
        const response = {
          baseCharacter: {
            result
          }
        };
        res.status(200).json(response);
      } else {
        res.status(404).json({
          message: "Base character not found."
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: err
      });
    });
};

exports.baseCharacter_edit = (req, res, next) => {
  const id = req.params.baseCharacterId;
  const updateOps = {};
  const keys = Object.keys(req.body);
  for (const key of keys) {
    updateOps[key] = req.body[key];
  }
  BaseCharacter.update(
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
        message: "Base character updated.",
        request: {
          type: "GET",
          url: req.protocol + "://" + req.get("host") + "/baseCharacter/" + id
        }
      };
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json({
        error: err
      });
    });
};

exports.baseCharacter_delete = (req, res, next) => {
  const id = req.params.baseCharacterId;
  BaseCharacter.remove({
    _id: id
  })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Base character deleted.",
        request: {
          type: "GET",
          url: req.protocol + "://" + req.get("host") + "/baseCharacter/"
        }
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err
      });
    });
};
