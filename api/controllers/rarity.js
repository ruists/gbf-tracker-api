const mongoose = require("mongoose");
const Rarity = require("../models/rarity");

exports.rarity_getAll = (req, res, next) => {
  Rarity.find()
    .select("-__v")
    .lean()
    .exec()
    .then((result) => {
      const response = {
        count: result.length,
        rarities: result.map((rarity) => {
          return {
            rarity,
            request: {
              type: "GET",
              url:
                req.protocol + "://" + req.get("host") + "/rarity/" + rarity._id
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

exports.rarity_create = (req, res, next) => {
  const rarity = new Rarity({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name
  });
  rarity
    .save()
    .then((result) => {
      const response = {
        message: "Created rarity successfully.",
        rarity: {
          ...result.toJSON(),
          request: {
            type: "GET",
            url:
              req.protocol + "://" + req.get("host") + "/rarity/" + result._id
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

exports.rarity_getRarity = (req, res, next) => {
  const id = req.params.rarityId;
  Rarity.findById(id)
    .select("-__v")
    .lean()
    .exec()
    .then((result) => {
      if (result) {
        const response = {
          rarity: {
            result
          }
        };
        res.status(200).json(response);
      } else {
        res.status(404).json({
          message: "Rarity not found."
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: err
      });
    });
};

exports.rarity_edit = (req, res, next) => {
  const id = req.params.rarityId;
  const updateOps = {};
  const keys = Object.keys(req.body);
  for (const key of keys) {
    updateOps[key] = req.body[key];
  }
  Rarity.update(
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
        message: "Rarity updated.",
        request: {
          type: "GET",
          url: req.protocol + "://" + req.get("host") + "/rarity/" + id
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

exports.rarity_delete = (req, res, next) => {
  const id = req.params.rarityId;
  Rarity.remove({
    _id: id
  })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Rarity deleted.",
        request: {
          type: "GET",
          url: req.protocol + "://" + req.get("host") + "/rarity/"
        }
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err
      });
    });
};
