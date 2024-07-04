import 'dotenv/config'

export const env = {
    MONGODB_URI: process.env.MONGODB_URI,
    MONGO_DB: process.env.MONGO_DB,
    DATABASE_NAME: process.env.DATABASE_NAME,
    APP_HOST: process.env.APP_HOST,
    SERVER_PORT: process.env.SERVER_PORT,
    CLIENT_PORT: process.env.CLIENT_PORT,
    APP_PORT: process.env.APP_PORT,
    AUTHOR: process.env.AUTHOR,
    SECRET_KEY: process.env.SECRET_KEY,
    RSECRET_KEY: process.env.RSECRET_KEY,
    MOMO_ACCESS_KEY: process.env.MOMO_ACCESS_KEY,
    MOMO_SECRET_KEY: process.env.MOMO_SECRET_KEY,
    MOMO_PARTNER_CODE: process.env.MOMO_PARTNER_CODE,
    MAIL_PASSWORD: process.env.MAIL_PASSWORD,
    MAIL_ACCOUNT: process.env.MAIL_ACCOUNT
}