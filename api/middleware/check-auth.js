const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.userData = decoded; //contains user ID for possible authorization purposes
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Authentication failed."
    });
  }
};
