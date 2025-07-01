import cloudinary from "../lib/cloudinary.js";
import TempImage from "../models/TempImage.js";

export async function storeTempImage(req, res) {
    try {
        const userId = req.user._id;
        const { publicId, url } = req.body;

        const existing = await TempImage.findOne({ userId });

        if (existing && !existing.used) {
            try {
                await cloudinary.uploader.destroy(existing.publicId);
                console.log("delete cloudinary")
                await TempImage.deleteOne({ _id: existing._id });
            } catch (cloudErr) {
                console.log("Cloudinary delete failed:", cloudErr.message);
            }
        }

        const response = await TempImage.create({
            userId,
            publicId,
            url
        })

        res.status(200).json({ response });
    } catch (error) {
        console.log("Error in storeTempImage controller", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function getUploadSecret(req, res) {
    try {
        const timestamp = Math.round(new Date().getTime() / 1000);
        const publicId = `profile/${req.user._id}_${timestamp}`
        const signature = cloudinary.utils.api_sign_request({ timestamp, public_id: publicId }, process.env.CLOUDINARY_API_SECRET);

        res.status(200).json({
            timestamp,
            signature,
            publicId,
            cloudName: process.env.CLOUDINARY_CLOUD_NAME,
            apiKey: process.env.CLOUDINARY_API_KEY
        })
    } catch (error) {
        console.log("Error in getUploadSecret controller", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}