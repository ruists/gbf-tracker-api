const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const checkAdmin = require('../middleware/check-admin');
const StyleController = require('../controllers/style')

router.get('/',
    StyleController.style_getAll);

router.post('/',
    checkAuth,
    checkAdmin,
    StyleController.style_create);

router.get('/:styleId',
    StyleController.style_getStyle);

//TODO: TEST
router.patch('/:styleId',
    checkAuth,
    checkAdmin,
    StyleController.style_edit);

router.delete('/:styleId',
    checkAuth,
    checkAdmin,
    StyleController.style_delete);

module.exports = router;