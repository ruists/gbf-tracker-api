const mongoose = require("mongoose");
const Summon = require("../models/summon");
const BaseSummon = require("../models/baseSummon");

exports.summon_getAll = (req, res, next) => {
  const userId = req.userData.userId;
  Summon.find({
    user: userId
  })
  .select("-__v")
  .lean({ autopopulate: true })
  .exec()
  .then((result) => {
    const response = {
      count: result.length,
      summons: result.map((summon) => {
        return {
          summon,
          request: {
            type: "GET",
            url:
            req.protocol + "://" + req.get("host") + "/summon/" + summon._id
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

exports.summon_create = (req, res, next) => {
  BaseSummon.findById(req.body.baseSummonId)
  .lean()
  .exec()
  .then((baseSummon) => {
    if (!baseSummon) {
      return res.status(500).json({
        message: "Base summon not found."
      });
    }
    const summon = new Summon({
      _id: new mongoose.Types.ObjectId(),
      uncap: req.body.uncap,
      level: req.body.level,
      baseSummon: baseSummon._id,
      user: req.userData.userId
    });
    return summon.save();
  })
  .then((result) => {
    if (res.statusCode === 500) {
      return res;
    }
    const response = {
      message: "Created summon successfully.",
      request: {
        type: "GET",
        url: req.protocol + "://" + req.get("host") + "/´summon/" + result._id
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

exports.summon_getSummon = (req, res, next) => {
  const id = req.params.summonId;
  const userId = req.userData.userId;
  Summon.findById(id)
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
          summon: {
            result
          }
        };
        res.status(200).json(response);
      }
    } else {
      res.status(404).json({
        message: "Summon not found."
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

exports.summon_edit = (req, res, next) => {
  const id = req.params.summonId;
  const userId = req.userData.userId;
  const updateOps = {};
  const keys = Object.keys(req.body);
  for (const key of keys) {
    updateOps[key] = req.body[key];
  }
  Summon.findById(id)
  .select("-__v")
  .lean({autopopulate: true})
  .exec()
  -then((summon) => {
    if(summon) {
      if(summon.user !== userId) {
        res.status(403).json({
          message: "Unauthorized access to resource."
        });
      } else {
        Summon.updateOne(
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
              message: "Summon updated.",
              request: {
                type: "GET",
                url: req.protocol + "://" + req.get("host") + "/summon/" + id
              }
            };
            res.status(200).json(response);
          })
          .catch((err1) => {
            console.log(err1);
            res.status(500).json({
              error: err1
            });
          });
        }
      } else {
        res.status(404).json({
          error: "Summon not found."
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: err
      });
    });
};
  
exports.summon_delete = (req, res, next) => {
  const id = req.params.summonId;
  const userId = req.userData.userId;
  
  Summon.findById(id)
  .select("-__v")
  .lean({autopopulate: true})
  .exec()
  -then((summon) => {
    if(summon) {
      if(summon.user !== userId) {
        res.status(403).json({
          message: "Unauthorized access to resource."
        });
      } else {
        Summon.remove({
          _id: id
        })
        .exec()
        .then((result) => {
          res.status(200).json({
            message: "Summon deleted.",
            request: {
              type: "GET",
              url: req.protocol + "://" + req.get("host") + "/summon/"
            }
          });
        })
        .catch((err1) => {
          res.status(500).json({
            error: err1
          });
        });
      }
    } else {
      res.status(404).json({
        error: "Summon not found."
      });
    }
  })
  .catch((err) => {
    res.status(500).json({
      error: err
    });
  });
};
