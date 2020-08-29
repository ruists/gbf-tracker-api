const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const checkAdmin = require('../middleware/check-admin');
const RarityController = require('../controllers/rarity');

router.get('/',
    RarityController.rarity_getAll);

router.post('/',
    checkAuth,
    checkAdmin,
    RarityController.rarity_create);

router.get('/:rarityId',
    RarityController.rarity_getRarity);

//TODO: TEST
router.patch('/:rarityId',
    checkAuth,
    checkAdmin,
    RarityController.rarity_edit);

router.delete('/:rarityId',
    checkAuth,
    checkAdmin,
    RarityController.rarity_delete);

module.exports = router;