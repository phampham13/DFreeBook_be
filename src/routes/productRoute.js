const express = require("express");
const router = express.Router()
const productController = require('../controllers/ProductController');
const { authMiddleWare, authUserMiddleWare } = require('~/middlewares/authMiddleware')

router.post('/create', authMiddleWare, productController.createProduct)
router.put('/update/:id', authMiddleWare, productController.updateProduct)
router.delete('/delete/:id', authMiddleWare, productController.deleteProduct)
router.get('/getAll', productController.getAllProduct)
router.post('/delete-many', authMiddleWare, productController.deleteMany)
router.get('/getDetail/:id', productController.getDetailProduct)

module.exports = router

