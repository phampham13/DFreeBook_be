const BookCategoryService = require('~/services/BookCategoryService')
const JwtService = require('~/services/JwtService')

const createBookCategory = async (req, res) => {
    try {
        const { categoryName } = req.body
        if (!categoryName) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            })
        }

        const response = await BookCategoryService.createBookCategory(req.body)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: "Book Category Controller Error"
        })
    }
}


const deleteBookCategory = async (req, res) => {
    try {
        const categoryId = req.params.id
        if (!categoryId) {
            resolve({
                status: 'ERR',
                message: 'The userId is required'
            })
        }
        const response = await BookCategoryService.deleteBookCategory(categoryId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: " Book category controller delete Error"
        })
    }
}

const getAllBookCategory = async (req, res) => {
    try {
        const response = await BookCategoryService.getAllBookCategory()
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: "Book Category controller get all Error"
        })
    }
}

module.exports = {
    createBookCategory,
    deleteBookCategory,
    getAllBookCategory
}
