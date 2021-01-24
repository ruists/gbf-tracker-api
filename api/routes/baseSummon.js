const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const checkAdmin = require('../middleware/check-admin');
const BaseSummonController = require('../controllers/baseSummon');

router.get('/',
    BaseSummonController.baseSummon_getAll);

//TODO: TEST
//router.post('/', checkAuth, checkAdmin, BaseSummonController.baseSummon_create);

router.get('/:baseSummonId',
    BaseSummonController.baseSummon_getBaseSummon);

//TODO: TEST
//router.patch('/:baseSummonId', checkAuth, checkAdmin, BaseSummonController.baseSummon_edit);

router.delete('/:baseSummonId',
    checkAuth,
    checkAdmin,
    BaseSummonController.baseSummon_delete);

module.exports = router;