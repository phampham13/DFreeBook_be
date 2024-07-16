const BookCategory = require("../models/BookCategoryModel")
const Book = require("../models/BookModel")
//const bcrypt = require("bcrypt")
//const { genneralAccessToken, genneralRefreshToken } = require("./JwtService")

const createBookCategory = (newCategory) => {
    return new Promise(async (resolve, reject) => {
        const { categoryName } = newCategory
        try {
            const checkCategory = await BookCategory.findOne({
                categoryName: categoryName
            })
            if (checkCategory !== null) {
                resolve({
                    status: 'ERR',
                    message: 'The bookcategory is already'
                })
            }

            const createBookCategory = await BookCategory.create({
                categoryName
            })
            if (createBookCategory) {
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: createBookCategory,
                })
            }

        } catch (e) {
            reject(e)
        }
    })
}

const createCategory = (categoryName) => {
    const createBookCategory = BookCategory.create({
        categoryName
    })
}


const deleteBookCategory = async (categoryId) => {
    try {
        const checkCategory = await BookCategory.findOne({ _id: categoryId });
        if (!checkCategory) {
            return {
                status: 'ERR',
                message: 'The book category is not defined',
            };
        }

        await Book.deleteMany({ categoryName: checkCategory.categoryName });

        await BookCategory.findByIdAndDelete(categoryId);
        return {
            status: 'OK',
            message: 'Delete category and associated books success',
        };
    } catch (e) {
        return {
            status: 'ERR',
            message: e.message,
        };
    }
};

const getAllBookCategory = async () => {
    try {
        // Lấy tất cả các category và tính toán số đầu sách, tổng số sách và số sách có sẵn
        const allBookCategory = await BookCategory.aggregate([
            {
                $lookup: {
                    from: 'books', // Tên collection của Book
                    localField: 'categoryName',
                    foreignField: 'categoryName',
                    as: 'books'
                }
            },
            {
                $project: {
                    categoryName: 1,
                    bookCount: { $size: '$books' },
                    totalBooks: { $sum: '$books.quantityTotal' },
                    availableBooks: { $sum: '$books.quantityAvailable' }
                }
            }
        ]);

        return {
            status: 'OK',
            message: 'Success',
            data: allBookCategory
        };
    } catch (e) {
        return {
            status: 'ERR',
            message: e.message
        };
    }
};


const checkCategory = (categoryName) => {

    const category = BookCategory.findOne({
        categoryName: categoryName
    })
    return category
}

const updateCategory = async (categoryId, newCategory) => {
    try {
        const checkCategory = await BookCategory.findById(categoryId);
        if (!checkCategory) {
            return {
                status: 'ERR',
                message: 'The book category is not defined',
            };
        }
        await Book.updateMany({ categoryName: checkCategory.categoryName }, { categoryName: newCategory });

        // Cập nhật tên category trong bảng BookCategory
        await BookCategory.findByIdAndUpdate(categoryId, { categoryName: newCategory }, { new: true });

        return {
            status: 'OK',
            message: 'Update category and books success',
        };
    } catch (e) {
        return {
            status: 'ERR',
            message: e.message,
        };
    }
};

module.exports = {
    createBookCategory,
    createCategory,
    deleteBookCategory,
    getAllBookCategory,
    checkCategory,
    updateCategory
}