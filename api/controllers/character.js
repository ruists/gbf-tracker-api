const mongoose = require("mongoose");
const Character = require("../models/character");
const BaseCharacter = require("../models/baseCharacter");

exports.character_getAll = (req, res, next) => {
  const userId = req.userData.userId;
  Character.find({
    user: userId
  })
    .select("-__v")
    .lean({ autopopulate: true })
    .exec()
    .then((result) => {
      const response = {
        count: result.length,
        characters: result.map((character) => {
          return {
            character,
            request: {
              type: "GET",
              url:
                req.protocol +
                "://" +
                req.get("host") +
                "/character/" +
                character._id
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

exports.character_create = (req, res, next) => {
  BaseCharacter.findById(req.body.baseCharacterId)
    .lean()
    .exec()
    .then((baseCharacter) => {
      if (!baseCharacter) {
        return res.status(500).json({
          message: "Base character not found."
        });
      }

      const character = new Character({
        _id: new mongoose.Types.ObjectId(),
        level: req.body.level,
        uncap: req.body.uncap,
        baseCharacter: baseCharacter._id
      });
      return character.save();
    })
    .then((result) => {
      if (res.statusCode === 500) {
        return res;
      }
      const response = {
        message: "Created character successfully",
        character: {
          ...result.toJSON(),
          request: {
            type: "GET",
            url:
              req.protocol +
              "://" +
              req.get("host") +
              "/character/" +
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

exports.character_getCharacter = (req, res, next) => {
  const id = req.params.characterId;
  const userId = req.userData.userId;
  Character.findById(id)
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
            character: {
              result
            }
          };
          res.status(200).json(response);
        }
      } else {
        res.status(404).json({
          message: "Character not found."
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: err
      });
    });
};

exports.character_edit = (req, res, next) => {
  const id = req.params.characterId;
  const updateOps = {};
  const keys = Object.keys(req.body);
  for (const key of keys) {
    updateOps[key] = req.body[key];
  }
  Character.update(
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
        message: "Character updated.",
        request: {
          type: "GET",
          url: req.protocol + "://" + req.get("host") + "/character/" + id
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

exports.character_delete = (req, res, next) => {
  const id = req.params.characterId;
  Character.remove({
    _id: id
  })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Character deleted.",
        request: {
          type: "GET",
          url: req.protocol + "://" + req.get("host") + "/character/"
        }
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err
      });
    });
};
