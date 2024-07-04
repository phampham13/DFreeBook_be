const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const BookSchema = new Schema({
    bookId: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
    quantity: { type: Number, required: true }
}, { _id: false })

const offBorrowerSlipSchema = new mongoose.Schema(
    {
        /* 1 Đang mượn, 2 Đã trả, 3 Quá hạn */
        state: { type: Number, default: 1, required: true },
        name: { type: String, required: true, required: true },
        phoneNumber: { type: String, required: true, required: true },
        books: [BookSchema],
        totalAmount: { type: Number, required: true },
        returnDate: {type: Date},
        dueDate: {type: Date}
    },
    {
        timestamps: true,
    }
);

// Tạo một pre-hook để tự động tính toán returnDate và penalty
offBorrowerSlipSchema.pre('save', function (next) {
    // Nếu state là 1 (Đang mượn) và returnDate chưa được đặt
    if (!this.dueDate) {
        // Lấy ngày hiện tại
        const currentDate = new Date();
        // hạn trả sách là 50 ngày kể từ khi phiếu mượn được tạo
        const dueDate = new Date(currentDate.getTime() + (50 * 24 * 60 * 60 * 1000));
        //const dueDate = new Date(currentDate.getTime() + (3 * 60 * 1000));
        this.dueDate = dueDate;
    }
    next();
})

const OffBorrowerSlip = mongoose.model('OffBorrowerSlip', offBorrowerSlipSchema);

module.exports = OffBorrowerSlip;
