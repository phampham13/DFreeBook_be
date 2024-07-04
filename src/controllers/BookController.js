const BookService = require('~/services/BookService')
const CategoryService = require('~/services/BookCategoryService')
const JwtService = require('~/services/JwtService')

const createBook = async (req, res) => {
    try {
        const { bookId, coverImg, name, categoryName } = req.body
        if (!bookId || !coverImg || !name || !categoryName) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            })
        }
        const checkCategory = await CategoryService.checkCategory(categoryName)

        if (checkCategory === null) {
            CategoryService.createCategory(categoryName)
        }
        const response = await BookService.createBook(req.body)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: "Book Controller Error",
            error: e.message
        })
    }
}

const updateBook = async (req, res) => {
    try {
        const id = req.params.id
        const data = req.body
        const checkCategory = await CategoryService.checkCategory(data.categoryName)

        if (checkCategory === null) {
            CategoryService.createCategory(data.categoryName)
        }
        if (!id) {
            resolve({
                status: 'ERR',
                message: 'The book id is required'
            })
        }
        const response = await BookService.updateBook(id, data)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: " Book controller update Error",
            error: e.message
        })
    }
}

const deleteBook = async (req, res) => {
    try {
        const bookId = req.params.id
        if (!bookId) {
            resolve({
                status: 'ERR',
                message: 'The bookId is required'
            })
        }
        const response = await BookService.deleteBook(bookId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: " Book controller delete Error"
        })
    }
}

const getAllBook = async (req, res) => {
    try {
        const { limit, page, sort, filter } = req.query
        const response = await BookService.getAllBook(Number(limit) || null, Number(page) || 0, sort, filter)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: "Book controller get all Error"
        })
    }
}

//Dành cho phía user
const getAll = async (req, res) => {
    try {
        const { limit, page, categoryName, keyword } = req.query
        const response = await BookService.getAll(Number(limit) || null, Number(page) || 1, categoryName, keyword)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e.message
        })
    }
}

const getDetailBook = async (req, res) => {
    try {
        const bookId = req.params.id
        if (!bookId) {
            resolve({
                status: 'ERR',
                message: 'The bookId is required'
            })
        }
        const response = await BookService.getDetailBook(bookId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: "Book controller get detail Error"
        })
    }
}

const deleteMany = async (req, res) => {
    try {
        const ids = req.body.ids
        if (!ids) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The ids is required'
            })
        }
        const response = await BookService.deleteManyBook(ids)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

module.exports = {
    createBook,
    updateBook,
    deleteBook,
    getAllBook,
    getAll,
    getDetailBook,
    deleteMany
}
