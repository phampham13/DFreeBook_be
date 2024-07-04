const express = require("express");
const router = express.Router()
const cardController = require('../controllers/CardController');
const { authUserMiddleWare } = require('~/middlewares/authMiddleware')

router.get('/:id', authUserMiddleWare, cardController.getDetail)
router.put('/update/:id', authUserMiddleWare, cardController.updateCard)
router.post('/addBook/:id', authUserMiddleWare, cardController.addBookToCard)

module.exports = router