const Product = require("../models/ProductModel")

const createProduct = (newProduct) => {
    return new Promise(async (resolve, reject) => {
        const { name, image, price, quantity, description } = newProduct
        try {
            const checkProduct = await Product.findOne({
                name: name
            })
            if (checkProduct !== null) {
                resolve({
                    status: 'ERR',
                    message: 'The product is already'
                })
            }

            const createProduct = await Product.create({
                name,
                image,
                price,
                quantity,
                description
            })
            if (createProduct) {
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: createProduct,
                })
            }

        } catch (e) {
            reject(e)
        }
    })
}

const updateProduct = (productId, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkProduct = await Product.findOne({
                _id: productId
            })
            if (checkProduct === null) {
                resolve({
                    status: 'ERR',
                    message: 'The product is not define'
                })
            }

            const updatedProduct = await Product.findByIdAndUpdate(productId, data, { new: true })
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: updatedProduct
            })
        } catch (e) {
            reject(e)
        }
    })
}

const deleteProduct = (productId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkProduct = await Product.findOne({
                _id: productId
            })
            if (checkProduct === null) {
                resolve({
                    status: 'ERR',
                    message: 'The product is not define'
                })
            }

            await Product.findByIdAndDelete(productId, { new: true })
            resolve({
                status: 'OK',
                message: 'Delete product success',
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getAllProduct = (limit, page, sort, filter) => {
    return new Promise(async (resolve, reject) => {
        try {
            const totalProduct = await Product.countDocuments()
            let allProduct = []
            if (filter) {
                const label = filter[0]
                const allObjectFilter = await Product.find({ [label]: { '$regex': filter[1] } }).limit(limit).sort({ createdAt: -1, updatedAt: -1 })
                resolve({
                    status: 'OK',
                    message: 'Success',
                    data: allObjectFilter,
                    total: totalProduct,
                    pageCurrent: Number(page + 1),
                    totalPage: Math.ceil(totalProduct / limit)
                })
            }
            if (sort) {
                const objectSort = {}
                objectSort[sort[1]] = sort[0]
                const allProductSort = await Product.find().limit(limit).skip(page * limit).sort(objectSort).sort({ createdAt: -1, updatedAt: -1 })
                resolve({
                    status: 'OK',
                    message: 'Success',
                    data: allProductSort,
                    total: totalProduct,
                    pageCurrent: Number(page + 1),
                    totalPage: Math.ceil(totalProduct / limit)
                })
            }
            if (!limit) {
                allProduct = await Product.find().sort({ createdAt: -1, updatedAt: -1 })
            } else {
                allProduct = await Product.find().limit(limit).skip(page * limit).sort({ createdAt: -1, updatedAt: -1 })
            }
            resolve({
                status: 'OK',
                message: 'Success',
                data: allProduct,
                total: totalProduct,
                pageCurrent: Number(page + 1),
                totalPage: Math.ceil(totalProduct / limit)
            })
        } catch (e) {
            reject(e)
        }
    })
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

const getDetailProduct = (productId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const product = await Product.findOne({
                _id: productId
            })
            if (product === null) {
                resolve({
                    status: 'ERR',
                    message: 'The product is not define'
                })
            }

            resolve({
                status: 'OK',
                message: 'Get detail success',
                data: product
            })
        } catch (e) {
            reject(e)
        }
    })
}

const deleteManyProduct = (ids) => {
    return new Promise(async (resolve, reject) => {
        try {
            await Product.deleteMany({ _id: ids })
            resolve({
                status: 'OK',
                message: 'Delete products success',
            })
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    createProduct,
    updateProduct,
    deleteProduct,
    getAllProduct,
    getDetailProduct,
    deleteManyProduct
}