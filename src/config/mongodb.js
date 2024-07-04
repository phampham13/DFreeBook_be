import { env } from '~/config/environment'

import mongoose from 'mongoose'

export const CONNECT_DB = async () => {
    await mongoose.connect(`mongodb+srv://phampham13:${env.MONGO_DB}@cluster0-phampham.nrtiunv.mongodb.net/dfreebook`)
        .then(() => {
            console.log('connect success!')
        })
        .catch((err) => {
            console.log(err)
        })
}

