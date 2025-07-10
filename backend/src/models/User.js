import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import { randomBytes, createHash } from 'crypto';

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        select: false
    },
    emailVerified: {
        type: Boolean,
        default: false
    },
    bio: {
        type: String,
        default: "",
    },
    profilePic: {
        type: String,
        default: "",
    },
    nativeLanguage: {
        type: String,
        default: "",
    },
    learningLanguage: {
        type: String,
        default: "",
    },
    location: {
        type: String,
        default: "",
    },
    isOnboarded: {
        type: Boolean,
        default: false,
    },
    resetPasswordToken: {
        type: String,
        select: false
    },
    resetPasswordExpire: {
        type: Date,
        select: false
    },
    friends: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "User",
        }
    ]
}, { timestamp: true })


userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    try {
        this.password = await bcrypt.hash(this.password, 10);
        next();
    } catch (error) {
        next(error)
    }
})

userSchema.methods.matchPassword = async function (enteredPassword) {
    const isPasswordCorrect = bcrypt.compare(enteredPassword, this.password);
    return isPasswordCorrect;
}

userSchema.methods.getResetPasswordToken = function () {
    const resetToken = randomBytes(32).toString('hex');
    this.resetPasswordToken = createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    return resetToken;
}

const User = mongoose.model("User", userSchema);
export default User;