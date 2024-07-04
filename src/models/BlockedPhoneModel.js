const mongoose = require('mongoose')

const blockedPhoneSchema = new mongoose.Schema(
    { 
        phoneNumber: { type: String, required: true, unique: true },
    }
)
const BlockedPhone = mongoose.model('BlockedPhone', blockedPhoneSchema);

module.exports = BlockedPhone