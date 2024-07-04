const { required } = require('joi');
const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema(
    {
        bookId: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        author: { type: String, required: true },
        categoryName: { type: String, default: "Chưa phân loại", required: true },
        quantityAvailable: { type: Number, required: true },
        quantityTotal: { type: Number, required: true },
        publisher: { type: String },
        coverImg: { type: String, required: true },
        description: { type: String },
        branch: { type: Number, default: "1" } //1 cơ sở Đại La, 2 Cầu Giấy
    },
    {
        timestamps: true,
    }
)

const Book = mongoose.model("Book", bookSchema);
module.exports = Book;