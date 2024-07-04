// scheduler.js

const cron = require('node-cron')
const BorrowerSlip = require('../models/BorrowerSlipModel')
const OffBorrowerSlip = require('../models/OffBorrowerSlipModel')
const User = require('../models/UserModel')
const BlockedPhone = require('../models/BlockedPhoneModel')
const EmailService = require('../services/EmailService')

// Lập lịch chạy một lần mỗi ngày
const slipCheck = cron.schedule('12 1 * * *', async () => {
    try {
        // Lấy danh sách các phiếu mượn chưa trả và quá hạn
        const newOverdueOnSlips = await BorrowerSlip.find({
            state: 1
        });
        //mảng chứa email của ng trả quá hạn
        const emails = []

        for (const borrowerSlip of newOverdueOnSlips) {
            const currentDate = new Date()
            const diffDays = (currentDate - borrowerSlip.dueDate) / (1000 * 60 * 60 * 24)
            if (diffDays > 0) {
                borrowerSlip.state = 3
                const user = await User.findOne({ _id: borrowerSlip.userId })
                emails.push(user.email)
                user.state = 1

                const existingBlockedPhone = await BlockedPhone.findOne({ phoneNumber: user.phoneNumber });
                if (!existingBlockedPhone) {
                    await BlockedPhone.create({ phoneNumber: user.phoneNumber });
                }

                await borrowerSlip.save()
                await user.save()
            }
        }
        //console.log("email", emails)
        if (emails.length > 0) {
            await EmailService.sendReminderEmail(emails)
        }

        const newOverdueOffSlips = await OffBorrowerSlip.find({
            state: 1
        });

        for (const borrowerSlip of newOverdueOffSlips) {
            const currentDate = new Date()
            const diffDays = (currentDate - borrowerSlip.dueDate) / (1000 * 60 * 60 * 24)
            if (diffDays > 0) {
                borrowerSlip.state = 3
                const existingBlockedPhone = await BlockedPhone.findOne({ phoneNumber: borrowerSlip.phoneNumber });
                if (!existingBlockedPhone) {
                    await BlockedPhone.create({ phoneNumber: borrowerSlip.phoneNumber });
                }
                await borrowerSlip.save()
            }
        }

    } catch (error) {
        console.error('Error updating penalties:', error);
    }
});
slipCheck.start()
console.log('Scheduler started.') // Thêm dòng log để xác nhận rằng lịch trình đã được khởi động


//module.exports = {slipCheck} 
