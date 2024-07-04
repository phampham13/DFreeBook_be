const express = require("express");
const router = express.Router()
const offSlipController = require('../controllers/OffBorrowerSlipController');
const { authMiddleWare } = require('~/middlewares/authMiddleware')

router.post('/create', authMiddleWare, offSlipController.createOffSlip)
router.get('/get-by-phone/:id', authMiddleWare, offSlipController.getAllOffSlip) //get all reader's slip
router.get('/get-detail/:id', authMiddleWare, offSlipController.getDetailOffSlip)
router.get('/get-all', authMiddleWare, offSlipController.getAll) //amin get all borrower slip
router.post('/delete-many', authMiddleWare, offSlipController.deleteMany)
router.delete('/delete/:id', authMiddleWare, offSlipController.deleteOffSlip)
router.patch('/update-state/:id', authMiddleWare, offSlipController.updateState)
router.get('/statistic/:id', authMiddleWare, offSlipController.callSlipStatistic)

module.exports = router