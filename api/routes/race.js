const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const checkAdmin = require('../middleware/check-admin');
const RaceController = require('../controllers/race');

router.get('/',
    RaceController.race_getAll);

router.post('/',
    checkAuth,
    checkAdmin,
    RaceController.race_create);

router.get('/:raceId',
    RaceController.race_getRace);

//TODO: TEST
router.patch('/:raceId',
    checkAuth,
    checkAdmin,
    RaceController.race_edit);

router.delete('/:raceId',
    checkAuth,
    checkAdmin,
    RaceController.race_delete);

module.exports = router;