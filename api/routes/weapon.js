const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const WeaponController = require('../controllers/weapon');

router.get('/',
    checkAuth,
    WeaponController.weapon_getAll);

router.post('/',
    checkAuth,
    WeaponController.weapon_create);

router.get('/:weaponId',
    checkAuth,
    WeaponController.weapon_getWeapon);

//TODO: TEST
router.patch('/:weaponId',
    checkAuth,
    WeaponController.weapon_edit);

router.delete('/:weaponId',
    checkAuth,
    WeaponController.weapon_delete);

module.exports = router;