const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ProductSchema = new Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true }
}, { _id: false })

const orderSchema = new mongoose.Schema({
    orderItems: [ProductSchema],
    shippingAddress: {
        name: { type: String, required: true },
        address: { type: String, required: true },
        phoneNumber: { type: Number, required: true },
    },
    //paymentMethod: { type: String, required: true },
    itemsPrice: { type: Number, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    note: { type: String },
    status: {
        type: String,
        enum: ['pending', 'shipped', 'returned'],
        default: 'pending',
        required: true
    },
    isPaid: { type: Boolean, default: false },
    transId: { type: String }
},
    {
        timestamps: true,
    }
);
const Order = mongoose.model('Order', orderSchema);
module.exports = Order