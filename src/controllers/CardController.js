const CardService = require('~/services/CardService')

const updateCard = async (req, res) => {
    try {
        const userId = req.params.id
        const data = req.body
        if (!userId) {
            resolve({
                status: 'ERR',
                message: 'The user id is required'
            })
        }
        const response = await CardService.updateCard(userId, data)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: " Card controller update Error",
            error: e.message
        })
    }
}

const addBookToCard = async (req, res) => {
    try {
        const userId = req.params.id
        const response = await CardService.addBookToCard(userId, req.body)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: "add book to card controller error",
            error: e.message
        })
    }
}


const getDetail = async (req, res) => {
    try {
        //console.log("card", req.headers)
        const userId = req.params.id
        if (!userId) {
            resolve({
                status: 'ERR',
                message: 'The userId is required'
            })
        }
        const response = await CardService.getDetail(userId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e.message
        })
    }
}

module.exports = {
    getDetail,
    updateCard,
    addBookToCard
};