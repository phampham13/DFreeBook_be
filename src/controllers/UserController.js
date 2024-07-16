const UserService = require('~/services/UserService')
const JwtService = require('~/services/JwtService')
const jwt = require('jsonwebtoken')
import { env } from '~/config/environment'
const { verify } = require('jsonwebtoken')

const createUser = async (req, res) => {
    try {
        const { name, email, password, phoneNumber } = req.body
        const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
        const isCheckEmail = reg.test(email)
        if (!name || !email || !password || !phoneNumber) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            })
        } else if (!isCheckEmail) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is not email'
            })
        }
        const response = await UserService.createUser(req.body)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: "controller Error"
        })
    }
}

const loginUser = async (req, res) => {
    try {
        const { password, phoneNumber } = req.body
        //const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
        //const isCheckEmail = reg.test(email)
        if (!password || !phoneNumber) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is required'
            })
        } /*else if (!isCheckEmail) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input is not email'
            })
        }*/
        //console.log('isCheckEmail', isCheckEmail)
        const response = await UserService.loginUser(req.body)
        const { refresh_token, ...newResponse } = response
        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            secure: false, //khi nao desplay dẻ thành true?
            sameSite: 'strict',
            path: '/',
        })
        return res.status(200).json(response) //newResponse
    } catch (e) {
        return res.status(404).json({
            message: e.message
        })
    }
}

const sendResetLinkEmail = async (req, res) => {
    try {
        const { email } = req.body
        if (!email) {
            return res.status(200).json({
                status: "ERR",
                message: "Email is require"
            })
        }
        const response = await UserService.sendResetLinkEmail(email)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e.message
        })
    }
}

const resetPassword = async (req, res) => {
    try {
        const { email, token, password } = req.body
        if (!email || !token || !password) {
            return res.status(200).json({
                status: "ERR",
                message: "Input is required"
            })
        }
        const response = await UserService.resetPassword(email, token, password)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e.message
        })
    }
}

const updateUser = async (req, res) => {
    try {
        const userId = req.params.id
        const data = req.body
        if (!userId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The userId is required'
            })
        }
        const response = await UserService.updateUser(userId, data)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e.message
        })
    }
}

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id
        if (!userId) {
            return res.status(400).json({
                status: 'ERR',
                message: 'The userId is required'
            })
        }
        const response = await UserService.deleteUser(userId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: "controller Error"
        })
    }
}

const getAllUser = async (req, res) => {
    try {
        const response = await UserService.getAllUser()
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: "controller Error"
        })
    }
}

const getDetailUser = async (req, res) => {
    try {
        const userId = req.params.id
        if (!userId) {
            resolve({
                status: 'ERR',
                message: 'The userId is required'
            })
        }
        const response = await UserService.getDetailUser(userId)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: "controller Error"
        })
    }
}

const refreshToken = async (req, res) => {
    try {
        //let token = req.headers.token.split(' ')[1]
        let token = req.cookies.refresh_token
        if (!token) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The token is required'
            })
        }
        const response = await JwtService.refreshTokenJwtService(token)
        return res.status(200).json(response)
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

const verifyToken = (req, res) => {
    try {
        const { token } = req.body;
        console.log("be bắt token ----", token)
        if (!token) {
            return res.status(400).json({ message: "Token is required" });
        }
        const kq = jwt.verify(token, env.SECRET_KEY);
        //console.log("kq", kq)

        if (kq) {
            return res.status(200).json({
                status: "OK",
                message: "Verify successful",
                data: kq
            })
        } else {
            return res.status(401).json({
                message: "Token verification failed",
                errCodeCheckLogin: 1
            })
        }
    } catch (error) {
        console.error("Token verification error:", error.message);
        return res.status(401).json({
            message: "Verification failed",
            error: error.message
        })
    }
};

const logoutUser = async (req, res) => {
    try {
        res.clearCookie('refresh_token')
        return res.status(200).json({
            status: 'OK',
            message: 'Logout successfully'
        })
    } catch (e) {
        return res.status(404).json({
            message: e
        })
    }
}

module.exports = {
    createUser,
    loginUser,
    sendResetLinkEmail,
    resetPassword,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailUser,
    refreshToken,
    verifyToken,
    logoutUser
}