const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const BookSchema = new Schema({
    bookId: { type: Schema.Types.ObjectId, ref: 'Book' },
    quantity: { type: Number }
}, { _id: false })

const borrowerCardSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    books: [BookSchema]
},
    {
        timestamps: true,
    }
);
const BorrowerCard = mongoose.model('BorrowerCard', borrowerCardSchema);

module.exports = BorrowerCard;