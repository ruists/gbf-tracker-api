const User = require('../models/user');

module.exports = (req, res, next) => {
    const id = req.userData.userId;

    User.findById(id)
        .populate('role', 'name')
        .lean()
        .exec()
        .then(user => {
            if (!user) {
                return res.status(401).json({
                    message: 'Authorization failed.'
                });
            }
            
            if (user.role.name.valueOf() === "Admin") {
                next();
            } else {
                return res.status(401).json({
                    message: 'Authorization failed.'
                });
            }
        }).catch(err => {
            return res.status(401).json({
                message: 'Authorization failed.'
            });
        });
};