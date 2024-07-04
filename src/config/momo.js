import { env } from '~/config/environment'

module.exports = {
    partnerCode: env.MOMO_PARTNER_CODE,
    accessKey: env.MOMO_ACCESS_KEY,
    secretKey: env.MOMO_SECRET_KEY,
    orderInfo: 'pay with MoMo',
    redirectUrl: env.CLIENT_PORT,
    ipnBase: `${env.SERVER_PORT}/momo/`,
    requestType: 'captureWallet',
    extraData: '',
    orderGroupId: '',
    autoCapture: true,
    lang: 'vi',
}