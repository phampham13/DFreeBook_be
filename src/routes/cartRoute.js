const express = require("express");
const router = express.Router()
const cartController = require('../controllers/CartController');
const { authUserMiddleWare } = require('~/middlewares/authMiddleware')

router.get('/:id', authUserMiddleWare, cartController.getDetail)
router.put('/update/:id', authUserMiddleWare, cartController.updateCart)
router.post('/addProduct/:id', authUserMiddleWare, cartController.addProductToCart)

module.exports = router