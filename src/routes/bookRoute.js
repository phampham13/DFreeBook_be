const express = require("express");
const router = express.Router()
const bookController = require('../controllers/BookController');
const { authMiddleWare } = require('~/middlewares/authMiddleware')

router.post('/create', authMiddleWare, bookController.createBook)
router.put('/update/:id', authMiddleWare, bookController.updateBook)
router.delete('/delete/:id', authMiddleWare, bookController.deleteBook)
router.get('/getAll', bookController.getAllBook)
router.get('/get-by-user', bookController.getAll)
router.post('/delete-many', authMiddleWare, bookController.deleteMany)
router.get('/getDetail/:id', bookController.getDetailBook)
//router.get('/getBookCategory', bookController.getCategory)

module.exports = router