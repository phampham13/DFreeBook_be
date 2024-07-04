const express = require('express')
const router = express.Router()
const userController = require('../controllers/UserController')
const { authMiddleWare, authUserMiddleWare } = require('~/middlewares/authMiddleware')

router.post('/sign-up', userController.createUser)
router.post('/sign-in', userController.loginUser)
router.put('/update-user/:id', userController.updateUser)
router.delete('/delete-user/:id', authMiddleWare, userController.deleteUser)
router.get('/getAll', authMiddleWare, userController.getAllUser)
router.get('/get-detail/:id', authUserMiddleWare, userController.getDetailUser)
router.post('/verify', userController.verifyToken);
router.post('/refresh-token', userController.refreshToken)
router.post('/password-send-email', userController.sendResetLinkEmail)
router.post('/password-reset', userController.resetPassword)

module.exports = router
