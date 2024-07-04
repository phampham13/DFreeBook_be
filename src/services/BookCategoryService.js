const BookCategory = require("../models/BookCategoryModel")
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


const deleteBookCategory = (categoryId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkCategory = await BookCategory.findOne({
                _id: categoryId
            })
            if (checkCategory === null) {
                resolve({
                    status: 'ERR',
                    message: 'The book category is not define'
                })
            }

            await BookCategory.findByIdAndDelete(categoryId, { new: true })
            resolve({
                status: 'OK',
                message: 'Delete category success',
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getAllBookCategory = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allBookCategory = await BookCategory.find()
            resolve({
                status: 'OK',
                message: 'Success',
                data: allBookCategory
            })
        } catch (e) {
            reject(e)
        }
    })
}

const checkCategory = (categoryName) => {

    const category = BookCategory.findOne({
        categoryName: categoryName
    })
    return category
}

/*const getAllProduct = async (limit, page, sort, filter) => {
    try {
        let query = Product.find();
        if (filter && filter.length === 2) {
            const [label, value] = filter;
            query = query.where(label).regex(new RegExp(value, 'i'));
            console.log(query)
        }

        if (sort && sort.length === 2) {
            const [order, field] = sort;
            const sortOption = {};
            sortOption[field] = order;
            query = query.sort(sortOption);
        } else {
            query = query.sort({ createdAt: -1, updatedAt: -1 });
        }

        if (limit) {
            query = query.limit(limit).skip(page * limit);
        }

        const totalProduct = await Product.countDocuments();
        const allProduct = await query.exec();

        return {
            status: 'OK',
            message: 'Success',
            data: allProduct,
            total: totalProduct,
            pageCurrent: Number(page + 1),
            totalPage: Math.ceil(totalProduct / limit)
        };
    } catch (error) {
        throw error;
    }
};*/

module.exports = {
    createBookCategory,
    createCategory,
    deleteBookCategory,
    getAllBookCategory,
    checkCategory
}