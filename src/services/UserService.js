import { env } from '~/config/environment'
const jwt = require('jsonwebtoken');
const User = require("../models/UserModel")
const BlockPhone = require("../models/BlockedPhoneModel")
const bcrypt = require("bcrypt")
const { genneralAccessToken, genneralRefreshToken } = require("./JwtService")
const cartService = require("./CartService");
const cardService = require("./CardService")
const EmailService = require("./EmailService")

const createUser = (newUser) => {
    return new Promise(async (resolve, reject) => {
        const { name, email, password, phoneNumber, role } = newUser
        try {
            /*const checkUser = await User.findOne({
                phoneNumber: phoneNumber
            })*/
            const checkUser = await User.findOne({
                $or: [
                    { email: email },
                    { phoneNumber: phoneNumber }
                ]
            });

            if (checkUser !== null) {
                return resolve({
                    status: 'ERR',
                    message: 'Số điện thoại hoặc email đã đăng kí tài khoản'
                })
            }
            bcrypt.hash(password, 10, async (err, hash) => {
                if (err) {
                    return resolve({
                        status: 'ERR',
                        message: 'Failed to hash password'
                    })
                }

                const createUser = await User.create({
                    name,
                    email,
                    password: hash,
                    phoneNumber,
                    role
                })

                if (createUser) {
                    const userCart = await cartService.createCart(createUser._id);
                    const userCard = await cardService.createCard(createUser._id)

                    if (userCart && userCard) {
                        resolve({
                            status: 'OK',
                            message: 'SUCCESS',
                            data: createUser,
                        })
                    }
                }
            })
        } catch (e) {
            return reject({
                status: 'ERR',
                message: 'Failed to create user',
                error: e.message
            });
        }
    })
}

const loginUser = (user) => {
    return new Promise(async (resolve, reject) => {
        const { password, phoneNumber } = user
        try {
            const checkUser = await User.findOne({
                phoneNumber: phoneNumber
            })
            if (checkUser === null) {
                return resolve({
                    status: 'ERR',
                    message: 'Số điện thoại chưa đăng kí'
                })
            }

            bcrypt.compare(password, checkUser.password, function (err, result) {
                if (result == true) {
                    const access_token = genneralAccessToken({
                        id: checkUser._id,
                        role: checkUser.role
                    })

                    const refresh_token = genneralRefreshToken({
                        id: checkUser._id,
                        role: checkUser.role
                    })

                    resolve({
                        status: 'OK',
                        message: 'SUCCESS',
                        access_token: access_token,
                        refresh_token: refresh_token
                    })
                } else {
                    resolve({
                        status: 'ERR',
                        message: 'Sai mật khẩu'
                    })
                }
            });
        } catch (e) {
            reject(e)
        }
    })
}

const sendResetLinkEmail = (email) => {
    return new Promise(async (resolve, reject) => {

        try {
            const checkUser = await User.findOne({
                email: email
            })
            if (checkUser === null) {
                return resolve({
                    status: 'ERR',
                    message: 'Email này chưa đăng kí tài khoản'
                })
            }

            const token = jwt.sign({ email }, env.SECRET_KEY, {
                expiresIn: "2h",
            });
            await EmailService.sendResetLink(checkUser.email, token)
            resolve({
                status: "OK",
                message: 'Ckeck your email'
            })

        } catch (e) {
            reject(e)
        }
    })
}

const resetPassword = (email, token, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({
                email: email
            })
            if (checkUser === null) {
                return resolve({
                    status: 'ERR',
                    message: 'Không tìm thấy tài khoản'
                })
            }

            jwt.verify(token, env.SECRET_KEY, function (err, user) {
                if (err) {
                    return res.status(403).json({
                        status: 'ERR',
                        message: 'Token is not valid'
                    })
                }

                bcrypt.hash(password, 10, async (err, hash) => {
                    if (err) {
                        return resolve({
                            status: 'ERR',
                            message: 'Failed to hash password'
                        })
                    }

                    checkUser.password = hash
                    await checkUser.save()

                    resolve({
                        status: 'OK',
                        message: "Reset password complete"
                    })
                })
            })
        } catch (e) {
            reject(e)
        }
    })
}


const updateUser = (userId, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({
                _id: userId
            })
            if (checkUser === null) {
                resolve({
                    status: 'ERR',
                    message: 'The user is not define'
                })
            }

            if (data.email) {
                const emailExists = await User.findOne({
                    email: data.email,
                    _id: { $ne: userId }
                })
                if (emailExists) {
                    return resolve({
                        status: 'ERR',
                        message: 'Email này đã được sử dụng'
                    })
                }
            }

            if (data.phoneNumber) {
                const phoneNumberExists = await User.findOne({
                    phoneNumber: data.phoneNumber,
                    _id: { $ne: userId }
                })
                if (phoneNumberExists) {
                    return resolve({
                        status: 'ERR',
                        message: 'Số diện thoại này đã được sử dụng'
                    })
                }
            }

            const checkBlockPhone = await BlockPhone.findOne({ phoneNumber: checkUser.phoneNumber })
            if (!checkBlockPhone) {
                await BlockPhone.create({ phoneNumber: data.phoneNumber })
            }

            const updatedUser = await User.findByIdAndUpdate(userId, data, { new: true })
            //console.log('updateUser', updateUser)
            resolve({
                status: 'OK',
                message: 'SUCCESS',
                data: updatedUser
            })
        } catch (e) {
            reject(e)
        }
    })
}

const deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({
                _id: userId
            })
            if (checkUser === null) {
                resolve({
                    status: 'ERR',
                    message: 'The user is not define'
                })
            }

            await User.findByIdAndDelete(userId, { new: true })

            const deleteCartResult = await cartService.deleteCart(userId);
            if (deleteCartResult.status === 'ERR') {
                return resolve(deleteCartResult);
            }

            const deleteCardResult = await cardService.deleteCard(userId);
            if (deleteCardResult.status === 'ERR') {
                return resolve(deleteCardResult);
            }
            //console.log('Deleted User')
            resolve({
                status: 'OK',
                message: 'Delete user success',
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getAllUser = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allUser = await User.find()
            resolve({
                status: 'OK',
                message: 'Success',
                data: allUser
            })
        } catch (e) {
            reject(e)
        }
    })
}

const getDetailUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findOne({
                _id: userId
            })
            if (user === null) {
                resolve({
                    status: 'ERR',
                    message: 'The user is not define'
                })
            }

            resolve({
                status: 'OK',
                message: 'Get detail success',
                data: user
            })
        } catch (e) {
            reject(e)
        }
    })
}

const isBlockedUser = async (userId) => {
    try {
        const user = await User.findById(userId)
        if (user && user.state === 1) {
            return true
        } else {
            const phone = await BlockPhone.findOne({ phoneNumber: user.phoneNumber })
            if (phone) {
                return true
            }
        }
    } catch (error) {
        console.error("Error checking user state:", error)
        throw error;
    }
}

module.exports = {
    createUser,
    loginUser,
    updateUser,
    sendResetLinkEmail,
    resetPassword,
    deleteUser,
    getAllUser,
    getDetailUser,
    isBlockedUser
}