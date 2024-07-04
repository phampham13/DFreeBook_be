const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        phoneNumber: { type: String, required: true, unique: true },
        role: { type: String, default: 'user', required: true },
        state: { type: Number, default: 0, required: true } //0 thường, 1 block
        //access_token: { type: String, required: true },
        //refresh_token: { type: String, required: true },
    },
    {
        timestamps: true,
    }
)

const User = mongoose.model("User", userSchema);
module.exports = User;