const OrderService = require('../services/OrderService')

const createOrder = async (req, res) => {
    try {
        //const { paymentMethod, itemsPrice, shippingPrice, totalPrice, fullName, address, phone } = req.body
        const { orderItems, name, address, phoneNumber, email } = req.body
        if (!orderItems || !name || !address || !phoneNumber || !email) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            })
        }
        const response = await OrderService.createOrder(req.body)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e.message
        })
    }
}

const getAllUserOrder = async (req, res) => {
    try {
        const userId = req.params.id
        if (!userId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId is required'
            })
        }
        const response = await OrderService.getAllUserOrder(userId)
        return res.status(200).json(response)
    } catch (e) {
        // console.log(e)
        return res.status(404).json({
            message: e.message
        })
    }
}

const getDetailsOrder = async (req, res) => {
    try {
        const orderId = req.params.id
        if (!orderId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The orderId is required'
            })
        }
        const response = await OrderService.getOrderDetails(orderId)
        return res.status(200).json(response)
    } catch (e) {
        // console.log(e)
        return res.status(404).json({
            message: e.message
        })
    }
}

const cancelOrder = async (req, res) => {
    try {
        //const data = req.body.orderItems
        const orderId = req.params.id
        console.log("order", orderId)
        if (!orderId) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The orderId is required'
            })
        }
        const response = await OrderService.cancelOrder(orderId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const getAllOrder = async (req, res) => {
    try {
        const data = await OrderService.getAllOrder()
        return res.status(200).json(data)
    } catch (e) {
        // console.log(e)
        return res.status(404).json({
            message: e
        })
    }
}

const deleteOrder = async (req, res) => {
    try {
        const orderId = req.params.id
        if (!orderId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The userId is required'
            })
        }
        const response = await OrderService.deleteOrder(orderId)
        return res.status(200).json(response)
    } catch {
        return res.status(404).json({
            message: " order controller delete Error"
        })
    }
}

const deleteManyOrder = async (req, res) => {
    try {
        const ids = req.body.ids
        if (!ids) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The ids is required'
            })
        }
        const response = await OrderService.deleteManyOrder(ids)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e.message
        })
    }
}

const updateStatus = async (req, res) => {
    try {
        const orderId = req.params.id;
        const newStatus = req.body.newStatus;

        if (!newStatus) {
            return res.status(400).json({
                status: 'ERR',
                message: 'New status is required'
            });
        }

        const response = await OrderService.updateStatus(orderId, newStatus)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e.message
        })
    }
}

//thống kê doanh thu theo các tháng trong năm
const revenueStatistic = async (req, res) => {
    try {
        const year = req.params.id
        if (!year) {
            return res.status(400).json({
                status: "ERR",
                message: "year is require"
            })
        }
        const response = await OrderService.totalRevenueStatistic(year)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(400).json({
            message: e.message
        })
    }
}

module.exports = {
    createOrder,
    getAllUserOrder,
    getDetailsOrder,
    cancelOrder,
    getAllOrder,
    deleteOrder,
    deleteManyOrder,
    updateStatus,
    revenueStatistic
}