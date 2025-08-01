import express from "express"
import { addAllUsersToStream, login, logout, onboard, resetPassword, sendOtp, signup, verifyCode } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup)

router.post("/send-otp", sendOtp)

router.post("/login", login)

router.post("/logout", logout)

router.post("/onboard", protectRoute, onboard)

router.post("/verify-code", protectRoute, verifyCode)

router.post("/reset-password", protectRoute, resetPassword)

router.get("/me", protectRoute, (req, res) => {
    res.status(200).json({ success: true, user: req.user });
})

if (process.env.NODE_ENV === "development") {

    router.post("/add-all-users-to-stream", addAllUsersToStream)
}

export default router