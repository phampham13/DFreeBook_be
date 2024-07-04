const CartService = require('~/services/CartService')

const updateCart = async (req, res) => {
    try {
        const userId = req.params.id
        const data = req.body
        if (!userId) {
            resolve({
                status: 'ERR',
                message: 'The user id is required'
            })
        }
        const response = await CartService.updateCart(userId, data)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: " Cart controller update Error",
            error: e.message
        })
    }
}

const addProductToCart = async (req, res) => {
    try {
        const userId = req.params.id
        const response = await CartService.addProductToCart(userId, req.body)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: "add product to cart controller error",
            error: e.message
        })
    }
}

const getDetail = async (req, res) => {
    try {
        const userId = req.params.id
        if (!userId) {
            resolve({
                status: 'ERR',
                message: 'The userId is required'
            })
        }
        const response = await CartService.getDetail(userId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: "Cart controller get detail Error"
        })
    }
}

module.exports = {
    getDetail,
    updateCart,
    addProductToCart
};