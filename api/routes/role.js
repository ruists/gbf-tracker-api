const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const checkAdmin = require('../middleware/check-admin');
const RoleController = require('../controllers/role');

router.get('/',
    checkAuth,
    checkAdmin,
    RoleController.role_getAll);

router.post('/',
    checkAuth,
    checkAdmin,
    RoleController.role_create);

module.exports = router;