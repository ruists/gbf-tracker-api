const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const checkAdmin = require('../middleware/check-admin');
const BaseCharacterController = require('../controllers/baseCharacter');

router.get('/',
    BaseCharacterController.baseCharacter_getAll);

//TODO: TEST CHANGES TO WEAPONTYPE VALIDATION
router.post('/',
    checkAuth,
    checkAdmin,
    BaseCharacterController.baseCharacter_create);

router.get('/:baseCharacterId',
    BaseCharacterController.baseCharacter_getBaseCharacter);

//TODO: TEST
router.patch('/:baseCharacterId',
    checkAuth,
    checkAdmin,
    BaseCharacterController.baseCharacter_edit);

router.delete('/:baseCharacterId',
    checkAuth,
    checkAdmin,
    BaseCharacterController.baseCharacter_delete);

module.exports = router;