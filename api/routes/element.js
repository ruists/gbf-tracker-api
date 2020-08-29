const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const checkAdmin = require('../middleware/check-admin');

const ElementController = require('../controllers/element');

router.get('/',
    ElementController.element_getAll);

router.post('/',
    checkAuth,
    checkAdmin,
    ElementController.element_create);

router.get('/:elementId',
    ElementController.element_getElement);

//TODO: TEST
router.patch('/:elementId',
    checkAuth,
    checkAdmin,
    ElementController.element_edit);

router.delete('/:elementId',
    checkAuth,
    checkAdmin,
    ElementController.element_delete);

module.exports = router;