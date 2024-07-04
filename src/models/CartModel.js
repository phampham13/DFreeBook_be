const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Product' },
  quantity: { type: Number }
}, { _id: false })

const CartSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  products: [ProductSchema]
})

/*const CartSchema = new Schema({
  //cart_id: { type: String, required: true, unique: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  products: [{
    productId: { type: Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number }
  }]
});*/

const Cart = mongoose.model('Cart', CartSchema);

module.exports = Cart;