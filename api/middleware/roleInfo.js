const User = require('../models/user');

module.exports = (req, res, next) => {
    const id = req.userData.userId;

    User.findById(id)
        .lean()
        .exec()
        .then(user => {
            if (!user) {
                return res.status(401).json({
                    message: 'Authorization failed.'
                });
            }

            req.isAdmin = (user.role.name === "Admin");
            next();
        }).catch(err => {
            return res.status(401).json({
                message: 'Authorization failed.'
            });
        });
};