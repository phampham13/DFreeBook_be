import { env } from '~/config/environment'
const jwt = require('jsonwebtoken');

export const genneralAccessToken = (payload) => {
    const access_token = jwt.sign({
        payload
        //...payload
    }, env.SECRET_KEY, { expiresIn: '6h' }) //'6h'

    return access_token
}

export const genneralRefreshToken = (payload) => {
    const refresh_token = jwt.sign({
        payload
        //...payload
    }, env.RSECRET_KEY, { expiresIn: '30d' })

    return refresh_token
}

export const refreshTokenJwtService = (token) => {
    return new Promise(async (resolve, reject) => {
        try {
            jwt.verify(token, env.RSECRET_KEY, (err, user) => {
                if (err) {
                    resolve({
                        status: "ERR",
                        message: "can't refresh token",
                        errCodeCheckLogin: 1
                    })
                }
                const { payload } = user
                //nếu lỗi await general, async err,user
                const access_token = genneralAccessToken({
                    id: payload?.id,
                    role: payload?.role
                })
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    access_token
                })
            })
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    genneralAccessToken,
    genneralRefreshToken,
    refreshTokenJwtService
}