const BlockPhone = require("../models/BlockedPhoneModel")

const createBlockPhone = async (bPhone) => {
    const addBlockPhone = await BlockPhone.create({
        bPhone
    })
    return addBlockPhone
}

const createBPhone = (newPhone) => {
    return new Promise(async (resolve, reject) => {
        try {
            const check = await BlockPhone.findOne({
                phoneNumber: newPhone
            })
            if (check !== null) {
                resolve({
                    status: 'ERR',
                    message: 'The phone is already'
                })
            }

            const createBPhone = await BlockPhone.create({
                newPhone
            })
            if (createBPhone) {
                resolve({
                    status: 'OK',
                    message: 'SUCCESS',
                    data: createBPhone,
                })
            }

        } catch (e) {
            reject(e)
        }
    })
}

const deleteBPhone = (phone) => {
    return new Promise(async (resolve, reject) => {
        try {
            const check = await BlockPhone.findOne({
                phoneNumber: phone
            })
            if (check === null) {
                resolve({
                    status: 'ERR',
                    message: 'The phone number is not define'
                })
            }

            await BlockPhone.findOneAndDelete({ phoneNumber: phone }, { new: true });
            resolve({
                status: 'OK',
                message: 'Delete phone success',
            })
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    createBPhone,
    createBlockPhone,
    deleteBPhone
}