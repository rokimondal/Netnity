import { sendVerificationEmail, sendWellcomeEmail } from "../lib/email.js";
import jwt from "jsonwebtoken"
import OtpVerification from "../models/OtpVerification.js";
import User from "../models/User.js";
import { upsertStreamUser } from "../lib/steam.js";

export async function signup(req, res) {
    const { fullName, otp, email, password } = req.body;
    try {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" })
        }

        const otpRecord = await OtpVerification.findOne({ email });

        if (!otpRecord || otpRecord.purpose !== "signup" || otpRecord.otp !== otp) {
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

        if (purpose !== "signup" && purpose !== "forgotPassword" && purpose !== "login") {
            res.status(400).json({ message: "Invalid purpose" })
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

            const otpRecord = await OtpVerification.findOne({ email });

            if (!otpRecord || otpRecord.purpose !== "login" || otpRecord.otp !== otp) {
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
        const { fullName, bio, nativeLanguage, learningLanguage, location } = req.body;
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
        const updatedUser = await User.findByIdAndUpdate(userId, {
            ...req.body,
            isOnboarded: true,
        }, { new: true });

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