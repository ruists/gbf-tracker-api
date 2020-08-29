const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const SummonController = require('../controllers/summon');

router.get('/',
    checkAuth,
    SummonController.summon_getAll);

//TODO: TEST
router.post('/',
    checkAuth,
    SummonController.summon_create);

router.get('/:summonId',
    checkAuth,
    SummonController.summon_getSummon);

//TODO: TEST
router.patch('/:summonId',
    checkAuth,
    SummonController.summon_edit);

router.delete('/:summonId',
    checkAuth,
    SummonController.summon_delete);

module.exports = router;