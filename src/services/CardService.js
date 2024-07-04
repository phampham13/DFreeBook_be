const Card = require("~/models/CardModel");
const Book = require("~/models/BookModel")

const createCard = async (userId) => {
    try {
        const card = await Card.create({ userId })
        return card
    } catch (error) {
        return {
            status: 'ERR',
            message: 'Failed to create card',
            error: error.message
        };
    }
};

const deleteCard = async (userId) => {
    try {
        const card = await Card.findOneAndDelete({ userId: userId });
        if (!card) {
            return {
                status: 'ERR',
                message: 'Cart not found card for the user'
            };
        }
        return {
            status: 'OK',
            message: 'Delete card success'
        };
    } catch (error) {
        return {
            status: 'ERR',
            message: 'Failed to delete card',
            error: error.message
        };
    }
}

const updateCard = (userId, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const books = data.books
            for (const book of books) {
                const checkBook = await Book.findById(book.bookId)
                if (!checkBook) {
                    resolve({
                        status: "ERR",
                        message: `Khong tìm thấy sách ${book.bookId}`
                    })
                } else if (checkBook.quantityAvailable < book.quantity) {
                    resolve({
                        status: "ERR",
                        message: `Sách ${checkBook.name} không đủ`
                    })
                }
            }
            const card = await Card.findOneAndUpdate(
                { userId },
                { $set: { books: data.books } },
                { new: true }
            )

            if (!card) {
                resolve({
                    status: 'ERR',
                    message: 'Card not found'
                });
            } else {
                resolve({
                    status: 'OK',
                    message: 'Card updated successfully',
                    data: card
                });
            }
        } catch (e) {
            reject(e)
        }
    })
}

const addBookToCard = (userId, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { bookId, quantity } = data;

            const book = await Book.findById(bookId);
            if (!book) {
                return resolve({
                    status: 'ERR',
                    message: 'Book not found'
                });
            } else {
                if (book.quantityAvailable < quantity) {
                    resolve({
                        status: "ERR",
                        message: `Sách ${book.name} không đủ `
                    })
                }
            }

            // check cart existed
            let card = await Card.findOne({ userId: userId });
            if (!card) {
                return resolve({
                    status: 'ERR',
                    message: 'card not found'
                })
            }
            // find product in cart
            const cardBook = card.books.find(p => p.bookId.toString() === bookId);

            if (cardBook) {
                if (cardBook.quantity + quantity > book.quantityAvailable) {
                    return resolve({
                        status: 'ERR',
                        message: 'Số lượng trong giỏ vượt quá số lượng sẵn có'
                    });
                }
                cardBook.quantity += quantity;
            } else {
                if (quantity > book.quantityAvailable) {
                    return resolve({
                        status: 'ERR',
                        message: 'Số lượng trong giỏ vượt quá số lượng sẵn có'
                    })
                }
                card.books.push({ bookId: bookId, quantity: quantity });
            }
            await card.save();

            const totalAmount = card.books.reduce((sum, item) => sum + item.quantity, 0);

            resolve({
                status: 'OK',
                message: 'Book added to card successfully',
                data: card,
                total: totalAmount
            });
        } catch (e) {
            reject({
                status: 'ERR',
                message: 'Error adding book to card',
                error: e
            });
        }
    })
}

const getDetail = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const card = await Card.findOne({ userId }).populate('books.bookId', 'bookId name coverImg quantityAvailable');
            if (!card) {
                resolve({
                    status: 'ERR',
                    message: 'Card not found'
                });
            } else {
                const totalAmount = card.books.reduce((sum, item) => sum + item.quantity, 0);
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: {
                        books: card.books,
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
    createCard,
    deleteCard,
    updateCard,
    addBookToCard,
    getDetail
};