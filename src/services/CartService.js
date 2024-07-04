const Cart = require("../models/CartModel")
const User = require("~/models/UserModel")
const Product = require("~/models/ProductModel")

const createCart = async (userId) => {
    try {
        const cart = new Cart({ userId });
        await cart.save();
        return cart
    } catch (error) {
        return {
            status: 'ERR',
            message: 'Failed to create cart',
            error: error.message
        };
    }
};

const deleteCart = async (userId) => {
    try {
        const cart = await Cart.findOneAndDelete({ userId: userId });
        if (!cart) {
            return {
                status: 'ERR',
                message: 'Cart not found for the user'
            };
        }
        return {
            status: 'OK',
            message: 'Delete cart success'
        };
    } catch (error) {
        return {
            status: 'ERR',
            message: 'Failed to delete cart',
            error: error.message
        };
    }
}

const updateCart = (userId, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const products = data.products
            for (const product of products) {
                const checkProduct = await Product.findById(product.productId)
                if (!checkProduct) {
                    resolve({
                        status: "ERR",
                        message: `Khong tìm thấy sản phẩm ${product.ProductId}`
                    })
                } else if (checkProduct.quantity < product.quantity) {
                    resolve({
                        status: "ERR",
                        message: `Sản phẩm ${checkProduct.name} không đủ hàng`
                    })
                }
            }
            const cart = await Cart.findOneAndUpdate(
                { userId },
                { $set: { products: data.products } },
                { new: true }
            )

            if (!cart) {
                resolve({
                    status: 'ERR',
                    message: 'Cart not found'
                });
            } else {
                resolve({
                    status: 'OK',
                    message: 'Cart updated successfully',
                    data: cart
                });
            }
        } catch (e) {
            reject(e)
        }
    })
}

const addProductToCart = (userId, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { productId, quantity } = data;

            const product = await Product.findById(productId);
            if (!product) {
                return resolve({
                    status: 'ERR',
                    message: 'Product not found'
                });
            } else {
                if (product.quantity < quantity) {
                    resolve({
                        status: "ERR",
                        message: `Sản phẩm ${product.name} không đủ hàng`
                    })
                }
            }

            // check cart existed
            let cart = await Cart.findOne({ userId: userId });
            if (!cart) {
                return resolve({
                    status: 'ERR',
                    message: 'cart not found'
                })
            }
            // find product in cart
            const cartProduct = cart.products.find(p => p.productId.toString() === productId);

            if (cartProduct) {
                if (cartProduct.quantity + quantity > product.quantity) {
                    return resolve({
                        status: 'ERR',
                        message: 'Số lượng trong giỏ vượt quá số lượng sẵn có'
                    });
                }
                cartProduct.quantity += quantity;
            } else {
                if (quantity > product.quantity) {
                    return resolve({
                        status: 'ERR',
                        message: 'Số lượng trong giỏ vượt quá số lượng sẵn có'
                    });
                }
                cart.products.push({ productId: productId, quantity: quantity });
            }
            await cart.save();

            const totalAmount = cart.products.reduce((sum, item) => sum + item.quantity, 0);

            resolve({
                status: 'OK',
                message: 'Product added to cart successfully',
                data: cart,
                total: totalAmount
            });
        } catch (e) {
            reject({
                status: 'ERR',
                message: 'Error adding product to cart',
                error: e
            });
        }
    })
}

const getDetail = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const cart = await Cart.findOne({ userId }).populate('products.productId', 'name image price quantity');
            if (!cart) {
                resolve({
                    status: 'ERR',
                    message: 'Cart not found'
                });
            } else {
                const totalAmount = cart.products.reduce((sum, item) => sum + item.quantity, 0);
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: {
                        products: cart.products,
                        totalAmount: totalAmount
                    }
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    createCart,
    deleteCart,
    updateCart,
    getDetail,
    addProductToCart
};