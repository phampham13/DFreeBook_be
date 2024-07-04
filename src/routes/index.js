const UserRouter = require('./userRoute')
const ProductRouter = require('./productRoute')
const OrderRouter = require('./orderRoute')
const BookCategoryRouter = require('./bookCategoryRoute')
const BookRouter = require('./bookRoute')
const CartRouter = require('./cartRoute')
const CardRouter = require('./cardRoute')
const BorrowerSlip = require('./borrowerSlipRoute')
const OffBorrowerSlip = require('./offBorrowerSlipRoute')
const Momo = require('./momoRoute')

const routes = (app) => {
    app.use('/users', UserRouter)
    app.use('/products', ProductRouter)
    app.use('/order', OrderRouter)
    app.use('/bookCategories', BookCategoryRouter)
    app.use('/books', BookRouter)
    app.use('/cart', CartRouter)
    app.use('/card', CardRouter)
    app.use('/borrowerSlip', BorrowerSlip)
    app.use('/offBorrowerSlip', OffBorrowerSlip)
    app.use('/momo', Momo)
}

module.exports = routes