const OffBorrowerSlip = require('../models/OffBorrowerSlipModel');
const User = require('../models/UserModel');
const BorrowerSlip = require('../models/BorrowerSlipModel');

//true: có vi phạm, false: ko
const check = async (phoneNumber) => {
    try {
        const lateOffBrSlips = await OffBorrowerSlip.find({
            phoneNumber: phoneNumber,
            $or: [
                { state: 3 },
                { state: 2, paidLateFee: false }
            ]
        });

        const user = await User.findOne({ phoneNumber: phoneNumber });
        let lateBrSlips = [];
        if (user) {
            lateBrSlips = await BorrowerSlip.find({
                userId: user._id,
                $or: [
                    { state: 3 },
                    { state: 2, paidLateFee: false }
                ]
            });
        }
        let result = false

        if (lateOffBrSlips.length > 0 || lateBrSlips.length > 0) {
            result = true
        } else {
            result = false
        }

        return {
            result,
            lateOffBrSlip: lateOffBrSlips.length,
            lateBrSlip: lateBrSlips.length
        };
    } catch (error) {
        console.error('Error in BorrowerSlipCheckService.check:', error);
        throw error;
    }
}

module.exports = { check }
