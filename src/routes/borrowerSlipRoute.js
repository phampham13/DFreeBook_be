const express = require("express");
const router = express.Router()
const borrowerSlipController = require('../controllers/BorrowerSlipController');
const { authUserMiddleWare, authMiddleWare } = require('~/middlewares/authMiddleware')

router.post('/create', authUserMiddleWare, borrowerSlipController.createBorrowerSlip)
router.get('/get-user-slip/:id', authUserMiddleWare, borrowerSlipController.getAllUserSlip) //get all user's Slip
router.get('/get-by-phone/:id', authMiddleWare, borrowerSlipController.getByPhone)
router.get('/get-detail-slip/:id', authUserMiddleWare, borrowerSlipController.getDetailBorrowerSlip)
router.delete('/cancel-borrow/:id', authUserMiddleWare, borrowerSlipController.cancelBorrow)
router.get('/get-all-borrower-slip', authMiddleWare, borrowerSlipController.getAllBorrowerSlip) //amin get all borrower slip
router.post('/delete-many', authMiddleWare, borrowerSlipController.deleteMany)
router.delete('/delete/:id', authMiddleWare, borrowerSlipController.deleteBorrowerSlip)
router.patch('/update-state/:id', authMiddleWare, borrowerSlipController.updateState)
router.get('/statistic/:id', authMiddleWare, borrowerSlipController.callSlipStatistic)

module.exports = router