import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    purpose: {
        type: String,
        enum: ["signup", "forgotPassword", "login"],
        required: true,
    },
    otp: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 1200
    }
})
const OtpVerification = mongoose.model("OtpVerification", otpSchema);
export default OtpVerification;