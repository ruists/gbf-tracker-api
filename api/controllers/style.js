const mongoose = require("mongoose");
const Style = require("../models/style");

exports.style_getAll = (req, res, next) => {
  Style.find()
    .select("-__v")
    .lean()
    .exec()
    .then((result) => {
      const response = {
        count: result.length,
        styles: result.map((style) => {
          return {
            style,
            request: {
              type: "GET",
              url:
                req.protocol + "://" + req.get("host") + "/style/" + style._id
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

exports.style_create = (req, res, next) => {
  const style = new Style({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name
  });
  style
    .save()
    .then((result) => {
      const response = {
        message: "Created style successfully.",
        request: {
          type: "GET",
          url: req.protocol + "://" + req.get("host") + "/style/" + result._id
        }
      };
      res.status(201).json(response);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

exports.style_getStyle = (req, res, next) => {
  const id = req.params.styleId;
  Style.findById(id)
    .select("-__v")
    .lean()
    .exec()
    .then((result) => {
      if (result) {
        const response = {
          style: {
            result
          }
        };
        res.status(200).json(response);
      } else {
        res.status(404).json({
          message: "Style not found."
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

exports.style_edit = (req, res, next) => {
  const id = req.params.styleId;
  const updateOps = {};
  const keys = Object.keys(req.body);
  for (const key of keys) {
    updateOps[key] = req.body[key];
  }
  Style.update(
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
        message: "Style updated.",
        request: {
          type: "GET",
          url: req.protocol + "://" + req.get("host") + "/style/" + id
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

exports.style_delete = (req, res, next) => {
  const id = req.params.styleId;
  Style.remove({
    _id: id
  })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "Style deleted.",
        request: {
          type: "GET",
          url: req.protocol + "://" + req.get("host") + "/style/"
        }
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err
      });
    });
};
