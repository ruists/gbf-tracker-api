const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const checkAdmin = require('../middleware/check-admin');
const WeaponTypeController = require('../controllers/weaponType');

router.get('/',
    WeaponTypeController.weaponType_getAll);

router.post('/',
    checkAuth,
    checkAdmin,
    WeaponTypeController.weaponType_create);

router.get('/:weaponTypeId',
    WeaponTypeController.weaponType_getWeaponType);

//TODO: TEST
router.patch('/:weaponTypeId',
    checkAuth,
    checkAdmin,
    WeaponTypeController.weaponType_edit);

router.delete('/:weaponTypeId',
    checkAuth,
    checkAdmin,
    WeaponTypeController.weaponType_delete);

module.exports = router;