const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const checkAdmin = require('../middleware/check-admin');
const BaseWeaponController = require('../controllers/baseWeapon');

router.get('/',
    BaseWeaponController.baseWeapon_getAll);

//TODO: TEST
//router.post('/', checkAuth, checkAdmin, BaseWeaponController.baseWeapon_create);

router.get('/:baseWeaponId',
    BaseWeaponController.baseWeapon_getBaseWeapon);

//TODO: TEST
//router.patch('/:baseWeaponId', checkAuth, checkAdmin, BaseWeaponController.baseWeapon_edit);

router.delete('/:baseWeaponId',
    checkAuth,
    checkAdmin,
    BaseWeaponController.baseWeapon_delete);

module.exports = router;