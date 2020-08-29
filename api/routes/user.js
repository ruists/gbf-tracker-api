const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const checkAdmin = require('../middleware/check-admin');
const UserController = require('../controllers/user');

router.post('/signup',
    UserController.user_create);

router.post('/signupAdmin',
    checkAuth,
    checkAdmin,
    UserController.user_createAdmin);

router.post('/login',
    UserController.user_login);

router.delete('/:userId',
    UserController.user_delete);

module.exports = router;