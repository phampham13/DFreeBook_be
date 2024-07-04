const express = require("express");
const router = express.Router()
const orderController = require('../controllers/OrderController');
const { authUserMiddleWare, authMiddleWare } = require('~/middlewares/authMiddleware')

router.post('/create', authUserMiddleWare, orderController.createOrder)
router.get('/get-user-order/:id', authUserMiddleWare, orderController.getAllUserOrder) //get all user's orders
router.get('/get-detail-order/:id', authUserMiddleWare, orderController.getDetailsOrder)
router.delete('/cancel-order/:id', authUserMiddleWare, orderController.cancelOrder)
router.get('/get-all-order', authMiddleWare, orderController.getAllOrder)
router.post('/delete-many', authMiddleWare, orderController.deleteManyOrder)
router.delete('/delete/:id', authMiddleWare, orderController.deleteOrder)
router.put('/update-status/:id', authMiddleWare, orderController.updateStatus)
router.get('/revenue/:id', authMiddleWare, orderController.revenueStatistic)

module.exports = router