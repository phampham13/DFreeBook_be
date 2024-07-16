const OffSlipService = require('../services/OffSlipService')

const createOffSlip = async (req, res) => {
    try {
        //books đầu vào ở đây là mảng bookId (ko phải _id)
        const { bookIds, name, phoneNumber, totalAmount } = req.body
        if (bookIds.length === 0 || !name || !phoneNumber || !totalAmount) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            })
        }
        if (bookIds.length > 3) {
            return res.status(200).json({
                status: 'ERR',
                message: 'Không thể mượn đồng thời nhiều hơn 3'
            })
        }
        const response = await OffSlipService.createBorrowerSlip(req.body)
        return res.status(200).json(response)

    } catch (e) {
        return res.status(400).json({
            message: e.message
        })
    }
}

const getAllOffSlip = async (req, res) => {
    try {
        const phoneNumber = req.params.id
        if (!phoneNumber) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The phone number is required'
            })
        }
        const response = await OffSlipService.getAllOffSlip(phoneNumber)
        return res.status(200).json(response)

    } catch (e) {
        return res.status(400).json({
            message: e.message
        })
    }
}

const getDetailOffSlip = async (req, res) => {
    try {
        const bSlipId = req.params.id
        if (!bSlipId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The borrower Slip id is required'
            })
        }
        const response = await OffSlipService.getDetailOffSlip(bSlipId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(400).json({
            message: e.message
        })
    }
}

const getAll = async (req, res) => {
    try {
        const data = await OffSlipService.getAll()
        return res.status(200).json(data)
    } catch (e) {
        return res.status(400).json({
            message: e.message
        })
    }
}

const deleteMany = async (req, res) => {
    try {
        const response = await OffSlipService.deleteMany(req.body.ids)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(400).json({
            message: e.message
        })
    }
}

const deleteOffSlip = async (req, res) => {
    try {
        const bSlipId = req.params.id
        if (!bSlipId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The borrower slip id is required'
            })
        }
        const response = await OffSlipService.deleteOffSlip(bSlipId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(400).json({
            message: e.message
        })
    }
}

const updateState = async (req, res) => {
    try {
        const bSlipId = req.params.id;
        const { newState, lateFee, paidLateFee } = req.body

        if (!newState) {
            return res.status(400).json({
                status: 'ERR',
                message: 'New state is required'
            });
        }

        const response = await OffSlipService.updateState(bSlipId, newState, lateFee, paidLateFee)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(400).json({
            message: e.message
        })
    }
}

const callSlipStatistic = async (req, res) => {
    try {
        const year = req.params.id
        if (!year) {
            return res.status(400).json({
                status: "ERR",
                message: "year is require"
            })
        }
        const response = await OffSlipService.callSlipStatistic(year)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(400).json({
            message: e.message
        })
    }
}

module.exports = {
    createOffSlip,
    getAllOffSlip,
    getDetailOffSlip,
    getAll,
    deleteMany,
    deleteOffSlip,
    updateState,
    callSlipStatistic
}
