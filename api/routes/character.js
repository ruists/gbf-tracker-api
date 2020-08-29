const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const CharacterController = require('../controllers/character');

router.get('/',
    checkAuth,
    CharacterController.character_getAll);

router.post('/',
    checkAuth,
    CharacterController.character_create);

router.get('/:characterId',
    checkAuth,
    CharacterController.character_getCharacter);

//TODO: TEST
router.patch('/:characterId',
    checkAuth,
    CharacterController.character_edit);

router.delete('/:characterId',
    checkAuth,
    CharacterController.character_delete);

module.exports = router;