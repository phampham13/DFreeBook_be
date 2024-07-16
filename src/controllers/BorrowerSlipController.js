const BorrowerSlipService = require('../services/BorrowerSlipService')
//const BlockPhone = require('../services/BlockPhoneService')

const createBorrowerSlip = async (req, res) => {
    try {
        const { userId, books, name, address, phoneNumber, totalAmount } = req.body
        if (!userId || !books || !name || !address || !phoneNumber || !totalAmount) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            })
        }
        const response = await BorrowerSlipService.createBorrowerSlip(req.body)
        return res.status(200).json(response)

    } catch (e) {
        return res.status(404).json({
            message: e.message
        })
    }
}

//
const getAllUserSlip = async (req, res) => {
    try {
        const userId = req.params.id
        if (!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The user is required'
            })
        }
        const response = await BorrowerSlipService.getAllUserSlip(userId)
        return res.status(200).json(response)

    } catch (e) {
        return res.status(404).json({
            message: e.message
        })
    }

}

const getDetailBorrowerSlip = async (req, res) => {
    try {
        const bSlipId = req.params.id
        if (!bSlipId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The borrower Slip id is required'
            })
        }
        const response = await BorrowerSlipService.getDetailBorrowerSlip(bSlipId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e.message
        })
    }
}

const getByPhone = async (req, res) => {
    try {
        const phoneNumber = req.params.id
        if (!phoneNumber) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The borrower Slip id is required'
            })
        }
        const response = await BorrowerSlipService.getByPhone(phoneNumber)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e.message
        })
    }
}

const cancelBorrow = async (req, res) => {
    try {
        const bSlipId = req.params.id
        if (!bSlipId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The borrower slip id is required'
            })
        }
        const response = await BorrowerSlipService.cancelBorrow(bSlipId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e.message
        })
    }

}

const getAllBorrowerSlip = async (req, res) => {
    try {
        const data = await BorrowerSlipService.getAllBorrowerSlip()
        return res.status(200).json(data)
    } catch (e) {
        return res.status(404).json({
            message: e.message
        })
    }

}

const deleteMany = async (req, res) => {
    try {
        const response = await BorrowerSlipService.deleteMany(req.body.ids)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e.message
        })
    }
}

const deleteBorrowerSlip = async (req, res) => {
    try {
        const bSlipId = req.params.id
        if (!bSlipId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The borrower slip id is required'
            })
        }
        const response = await BorrowerSlipService.deleteBorrowerSlip(bSlipId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
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

        const response = await BorrowerSlipService.updateState(bSlipId, newState, lateFee, paidLateFee)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
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
        const response = await BorrowerSlipService.callSlipStatistic(year)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(400).json({
            message: e.message
        })
    }
}

module.exports = {
    createBorrowerSlip,
    getAllUserSlip,
    getDetailBorrowerSlip,
    getByPhone,
    cancelBorrow,
    getAllBorrowerSlip,
    deleteMany,
    deleteBorrowerSlip,
    updateState,
    callSlipStatistic
}
