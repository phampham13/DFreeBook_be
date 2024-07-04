const Order = require("../models/OrderModel")
const Product = require("../models/ProductModel")
const EmailService = require("../services/EmailService")

const createOrder = (newOrder) => {
    return new Promise(async (resolve, reject) => {
        //const { orderItems,paymentMethod, itemsPrice, shippingPrice, totalPrice, fullName, address, city, phone,user, isPaid, paidAt,email } = newOrder
        const { orderItems, itemsPrice, name, address, phoneNumber, userId, note, email } = newOrder
        try {
            const promises = orderItems.map(async (item) => {
                const productData = await Product.findOne(
                    {
                        _id: item.productId._id,
                        quantity: { $gte: item.quantity }
                    }
                )
                if (productData) {
                    return {
                        status: 'OK',
                        message: 'SUCCESS'
                    }
                }
                else {
                    return {
                        status: 'OK',
                        message: 'ERR',
                        name: item.productId.name
                    }
                }
            })
            const results = await Promise.all(promises)
            const outOfStockProduct = results && results.filter((item) => item.name)
            if (outOfStockProduct.length > 0) {
                const arrId = []
                outOfStockProduct.forEach((item) => {
                    arrId.push(item.name)
                })
                return resolve({
                    status: 'ERR',
                    message: `San pham: ${arrId.join(',')} khong du hang`
                })
            } else {
                const updateProduct = orderItems.map(async (item) => {
                    await Product.findOneAndUpdate(
                        {
                            _id: item.productId._id,
                            quantity: { $gte: item.quantity }
                        },
                        {
                            $inc: {
                                quantity: -item.quantity,
                            }
                        },
                    )
                })
                await Promise.all(updateProduct)
                const transformedOrderItems = orderItems.map((item) => ({
                    productId: item.productId._id,
                    quantity: item.quantity
                }));

                const createdOrder = await Order.create({
                    orderItems: transformedOrderItems,
                    shippingAddress: {
                        name,
                        address,
                        phoneNumber
                    },
                    // paymentMethod,
                    itemsPrice,
                    //shippingPrice,
                    //totalPrice,
                    user: userId,
                    note: note
                    //isPaid, paidAt
                })
                if (createdOrder) {
                    await EmailService.sendEmailCreateOrder(email, orderItems)
                    resolve({
                        status: 'OK',
                        message: 'success',
                        data: createdOrder
                    })
                }
            }
            resolve({
                status: 'OK',
                message: 'success'
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getAllUserOrder = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const orders = await Order.find({
                user: id
            }).populate({
                path: 'orderItems.productId',
                select: 'name image price'
            }).populate({
                path: 'user',
                select: 'name phoneNumber'
            }).sort({ createdAt: -1, updatedAt: -1 })

            if (orders === null) {
                return resolve({
                    status: 'ERR',
                    message: 'The  not defined'
                })
            }

            resolve({
                status: 'OK',
                message: 'SUCESSS',
                data: orders
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getOrderDetails = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const order = await Order.findById(id)
                .populate({
                    path: 'orderItems.productId',
                    select: 'name image price'
                })
                .populate({
                    path: 'user',
                    select: 'name phoneNumber' // select only the fields you need
                })
            if (order === null) {
                return resolve({
                    status: 'ERR',
                    message: 'The order is not defined'
                })
            }

            resolve({
                status: 'OK',
                message: 'SUCESSS',
                data: order
            })
        } catch (e) {
            reject(e)
        }
    })
}

const cancelOrder = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const order = await Order.findById(id)
            if (order.status !== "pending") {
                return resolve({
                    status: "ERR",
                    message: "Không thể hủy đơn sau khi đơn đã được ship"
                })
            }
            const data = order.orderItems
            const promises = data.map(async (item) => {
                const productData = await Product.findOneAndUpdate(
                    {
                        _id: item.productId,
                        //selled: { $gte: order.amount }
                    },
                    {
                        $inc: {
                            quantity: +item.quantity,
                            //selled: -order.amount
                        }
                    },
                    { new: true }
                )
                if (!productData) {
                    return {
                        status: 'Ok',
                        message: `sản phẩm có id ${item.productId} không còn tồn tại`
                    }
                } else {
                    return {
                        status: 'OK',
                        id: item.productId
                    }
                }
            })
            await Promise.all(promises)
            await Order.findByIdAndDelete(id, { new: true })
            resolve({
                status: "OK",
                message: "Hủy order thành công"
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getAllOrder = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allOrder = await Order.find().sort({ createdAt: -1, updatedAt: -1 })
            resolve({
                status: 'OK',
                message: 'Success',
                data: allOrder
            })
        } catch (e) {
            reject(e)
        }
    })
}

const deleteManyOrder = (ids) => {
    return new Promise(async (resolve, reject) => {
        try {
            await Order.deleteMany({ _id: ids })
            return resolve({
                status: 'OK',
                message: 'Delete product success',
            })
        } catch (e) {
            reject(e)
        }
    })
}

const deleteOrder = (orderId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkOrder = await Order.findOne({
                _id: orderId
            })
            if (checkOrder === null) {
                return resolve({
                    status: 'ERR',
                    message: 'The order is not define'
                })
            }

            await Order.findByIdAndDelete(orderId, { new: true })
            resolve({
                status: 'OK',
                message: 'Delete order success',
            })
        } catch (e) {
            reject(e)
        }
    })
}

const updateStatus = (orderId, newStatus) => {
    return new Promise(async (resolve, reject) => {
        try {
            const order = await Order.findById(orderId)
            if (!order) {
                return resolve({
                    status: "ERR",
                    message: "order is not define"
                })
            }
            const items = order.orderItems
            const currentStatus = order.status
            const validTransitions = {
                'pending': ['shipped', 'returned'],
                'shipped': ['returned'],
                'returned': []
            };

            if (!validTransitions[currentStatus].includes(newStatus)) {
                return resolve({
                    status: 'ERR',
                    message: `Cannot transition status from ${currentStatus} to ${newStatus}`,
                    data: currentStatus
                });
            }

            if (newStatus === 'returned' && (currentStatus === 'pending' || currentStatus === 'shipped')) {
                const promises = items.map(async (item) => {
                    const productData = await Product.findOneAndUpdate(
                        {
                            _id: item.productId,
                            //selled: { $gte: order.amount }
                        },
                        {
                            $inc: {
                                quantity: +item.quantity,
                                //selled: -order.amount
                            }
                        },
                        { new: true }
                    )
                    if (!productData) {
                        return resolve({
                            status: 'ERR',
                            message: `sản phẩm có id ${item.productId} không còn tồn tại`
                        })
                    } else {
                        return {
                            status: 'OK',
                            id: item.productId
                        }
                    }
                })
                await Promise.all(promises)
            }
            order.status = newStatus
            await order.save()
            if (order.status !== newStatus) {
                return resolve({
                    status: "ERR",
                    message: "Failed to update status"
                });
            }
            resolve({
                status: "OK",
                message: "update complete",
                data: order
            })
        } catch (e) {
            reject({
                status: "ERR",
                message: "update fail"
            })
        }
    })
}

const totalRevenueStatistic = (year) => {
    return new Promise(async (resolve, reject) => {
        try {
            //Tạo mảng để lưu tổng doanh thu theo tháng
            const monthlyRevenueStats = [];

            //Tạo biến tổng doanh thu
            let totalRevenue = 0
            for (let month = 1; month <= 12; month++) {
                //Xử lý điều kiện date trước khi thống kê doanh thu từng tháng
                let dateCondition;

                if ([1, 3, 5, 7, 8, 10, 12].includes(month)) {
                    dateCondition = [new Date(`${year}-0${month}-01`), new Date(`${year}-0${month}-31`)];
                } else if ([4, 6, 9, 11].includes(month)) {
                    dateCondition = [new Date(`${year}-0${month}-01`), new Date(`${year}-0${month}-30`)];
                } else if (month === 2) {
                    if ((year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0)) {
                        dateCondition = [new Date(`${year}-02-01`), new Date(`${year}-02-29`)];
                    } else {
                        dateCondition = [new Date(`${year}-02-01`), new Date(`${year}-02-28`)];
                    }
                }

                const monthlyStats = await Order.aggregate([
                    {
                        $match: {
                            itemsPrice: { $gt: 0 },
                            status: 'shipped',
                            createdAt: { $gte: dateCondition[0], $lte: dateCondition[1] }
                        }
                    },
                    {
                        $group: {
                            _id: null,
                            totalRevenue: { $sum: "$itemsPrice" },
                        }
                    }
                ]);

                const monthNames = ["January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"];
                const monthName = monthNames[month - 1];

                // Lưu thông tin thống kê cho tháng vào mảng monthlyRevenueStats
                if (monthlyStats.length > 0) {
                    totalRevenue += monthlyStats[0].totalRevenue;
                    monthlyRevenueStats.push({
                        month: monthName,
                        revenue: monthlyStats[0].totalRevenue
                    });
                } else {
                    monthlyRevenueStats.push({
                        month: monthName,
                        revenue: 0
                    });
                }
            }

            return resolve({
                status: "OK",
                message: "complete statistic",
                data: {
                    totalRevenue: totalRevenue,
                    monthlyRevenueStats: monthlyRevenueStats
                }
            })
        } catch (e) {
            reject(e)
        }
    })
}

const payOrderSuccess = async (orderId, transId) => {
    try {
        const order = await Order.findById(orderId)
        order.isPaid = true
        order.transId = transId
        await order.save()
        return {
            status: "OK",
            message: "Update order payment success"
        }
    } catch (e) {
        return {
            status: "ERR",
            message: e.message
        }
    }
}

module.exports = {
    createOrder,
    getAllUserOrder,
    getOrderDetails,
    cancelOrder,
    getAllOrder,
    deleteManyOrder,
    deleteOrder,
    updateStatus,
    totalRevenueStatistic,
    payOrderSuccess
}