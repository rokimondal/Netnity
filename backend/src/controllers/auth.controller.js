import { sendVerificationEmail, sendWellcomeEmail } from "../lib/email.js";
import jwt from "jsonwebtoken"
import OtpVerification from "../models/OtpVerification.js";
import User from "../models/User.js";
import { upsertStreamUser } from "../lib/steam.js";
import TempImage from "../models/TempImage.js";
import { createHash } from 'crypto';

export async function signup(req, res) {
    const { fullName, otp, email, password } = req.body;
    try {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" })
        }

        const otpRecord = await OtpVerification.findOne({ email, purpose: "signup" });

        if (!otpRecord || otpRecord.otp !== otp) {
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }
        await OtpVerification.deleteOne({ email });

        if (!email || !fullName || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        const existUser = await User.findOne({ email });
        if (existUser) {
            return res.status(400).json({ message: "Email already exists, please use a different one" });
        }
        const idx = Math.floor(Math.random() * 100) + 1;
        const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;
        const newUser = await User.create({
            email,
            fullName,
            password,
            emailVerified: true,
            profilePic: randomAvatar,
        })

        try {
            await upsertStreamUser({
                id: newUser._id.toString(),
                name: newUser.fullName,
                image: newUser.profilePic || ""
            })
        } catch (error) {
            console.log("Error creating Stream user:", error);
        }

        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET_KEY, { expiresIn: "7d" })

        res.cookie("token", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production"
        })
        const userObj = newUser.toObject();
        delete userObj.password;
        res.status(201).json({ success: true, user: userObj })
    } catch (error) {
        console.log("Error in signup controller ", error);
        res.status(501).json({ message: "Internal Server Error" })
    }

}

export async function sendOtp(req, res) {
    try {
        const { email, purpose } = req.body;

        if (!email || !purpose) {
            return res.status(400).json({ message: "Email and purpose are required" });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email" })
        }

        if (purpose !== "signup" && purpose !== "resetPassword" && purpose !== "login") {
            return res.status(400).json({ message: "Invalid purpose" })
        }

        if (purpose === "signup") {
            const existUser = await User.findOne({ email });
            if (existUser) {
                return res.status(400).json({ message: "Email already exists, please use a different one" });
            }
        } else if (purpose === "login") {
            const existUser = await User.findOne({ email });
            if (!existUser) {
                return res.status(400).json({ message: "There was an error in sending the OTP. Please try again!" });
            }
        } else if (purpose === "resetPassword") {
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: "User not found" });
            }
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        await OtpVerification.deleteOne({ email });

        await OtpVerification.create({
            email,
            purpose,
            otp
        });
        await sendVerificationEmail(email, otp);
        res.status(200).json({ success: true, message: "OTP sent successfully" })
    } catch (error) {
        console.log("Error in sending otp controller ", error);
        return res.status(500).json({ message: "Failed to send OTP. Please try again later." });
    }
}

export async function login(req, res) {
    try {

        const { type, email, otp, password } = req.body;

        let user = null;

        if (type === "password") {

            if (!password || !email) return res.status(401).json({ message: "All fields are required" });

            user = await User.findOne({ email }).select("+password");
            if (!user) return res.status(401).json({ message: "Invalid email and password" });

            const isPasswordCorrect = await user.matchPassword(password);
            if (!isPasswordCorrect) return res.status(401).json({ message: "Invalid email and password" });

        } else if (type === "otp") {
            if (!otp || !email) return res.status(401).json({ message: "All fields are required" });

            user = await User.findOne({ email });
            if (!user) return res.status(401).json({ message: "Invalid email and otp" });

            const otpRecord = await OtpVerification.findOne({ email, purpose: "login" });

            if (!otpRecord || otpRecord.otp !== otp) {
                return res.status(401).json({ message: "Invalid or expired otp" })
            }
            await OtpVerification.deleteOne({ email })
        } else {
            return res.status(401).json({ message: "Invalid login type" })
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "7d" })

        res.cookie("token", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production"
        })

        const userObj = user.toObject();
        delete userObj.password;

        res.status(200).json({ success: true, user: userObj })

    } catch (error) {
        console.log("Error in login controller ", error);
        res.status(501).json({ message: "Internal Server Error" })
    }
}

export async function logout(req, res) {
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "Logout successful" });
}

export async function onboard(req, res) {
    try {
        const userId = req.user._id;
        const { fullName, bio, nativeLanguage, learningLanguage, location, profilePic } = req.body;
        if (!fullName || !bio || !nativeLanguage || !learningLanguage || !location) {
            return res.status(400).json({
                message: "All fields are required",
                missingFields: [
                    !fullName && "fullName",
                    !bio && "bio",
                    !nativeLanguage && "nativeLanguage",
                    !learningLanguage && "learningLanguage",
                    !location && "location",
                ].filter(Boolean),
            });
        }

        const tempImage = await TempImage.findOne({ userId, url: profilePic });

        const updatedUser = await User.findByIdAndUpdate(userId, {
            ...req.body,
            isOnboarded: true,
        }, { new: true });

        if (tempImage) {
            await TempImage.findOneAndDelete(tempImage._id);
        }

        if (!updatedUser) return res.status(404).json({ message: "User not found" });

        try {
            await upsertStreamUser({
                id: updatedUser._id.toString(),
                name: updatedUser.fullName,
                image: updatedUser.profilePic || ""
            })
        } catch (error) {
            console.log("Error updating Stream user during onboarding:", error.message);
        }

        await sendWellcomeEmail(updatedUser.email, updatedUser.fullName);

        res.status(200).json({ success: true, user: updatedUser });
    } catch (error) {
        console.log("Error in onboarding", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function addAllUsersToStream(req, res) {
    try {
        const users = await User.find({});

        for (const user of users) {
            await upsertStreamUser({
                id: user._id.toString(),
                name: user.fullName,
                image: user.profilePic || ""
            });
        }

        res.status(200).json({ success: true, message: "All users added to Stream successfully." });
    } catch (error) {
        console.error("Error adding users to stream:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export async function verifyCode(req, res) {
    const { code } = req.body;
    const email = req.user.email;
    const userId = req.user._id;
    try {
        if (!code) {
            return res.status(400).json({ message: "Code is required" });
        }

        const otpRecord = await OtpVerification.findOne({ email, purpose: "resetPassword" });

        if (!otpRecord || otpRecord.otp !== code) {
            return res.status(400).json({ message: "Invalid or expired otp" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const resetToken = user.getResetPasswordToken();
        await user.save();

        await OtpVerification.deleteOne({ email });
        res.status(200).json({
            resetToken
        })
    } catch (error) {
        console.log("Error in verify code controller ", error);
        res.status(501).json({ message: "Internal Server Error" });
    }
}

export async function resetPassword(req, res) {
    const userId = req.user._id;
    const { resetToken, newPassword } = req.body;
    try {
        if (!resetToken || !newPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (newPassword.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }
        const hashToken = createHash("sha256").update(resetToken).digest("hex");
        const user = await User.findOne({
            _id: userId,
            resetPasswordToken: hashToken,
            resetPasswordExpire: { $gt: Date.now() }
        }).select("+password +resetPasswordToken +resetPasswordExpire");

        if (!user) {
            return res.status(400).json({ message: "Invalid or expired reset token" });
        }
        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();
        res.status(200).json({ success: true, message: "Password reset successfully" });
    } catch (error) {
        console.log("Error in reset password controller ", error);
        res.status(501).json({ message: "Internal Server Error" })
    }
}