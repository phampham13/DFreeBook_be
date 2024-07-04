const express = require("express");
const router = express.Router()
const bCategoryController = require('../controllers/BookCategoryController');
const { authMiddleWare, authUserMiddleWare } = require('~/middlewares/authMiddleware')

router.post('/create', authMiddleWare, bCategoryController.createBookCategory)
//router.put('/update/:id', authMiddleWare, bCategoryController.updateProduct)
router.delete('/delete/:id', authMiddleWare, bCategoryController.deleteBookCategory)
router.get('/getAll', bCategoryController.getAllBookCategory)
//router.post('/delete-many', authMiddleWare, bCategoryController.deleteMany)
//router.get('/getDetail/:id', bCategoryController.getDetailProduct)

module.exports = router