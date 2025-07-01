import cron from 'node-cron'
import TempImage from '../models/TempImage.js';
import cloudinary from '../lib/cloudinary.js';


cron.schedule('0 * * * *', async () => {
    try {
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        const unusedImages = await TempImage.find({
            used: false,
            createdAt: { $lt: oneHourAgo },
        })

        for (const image of unusedImages) {
            await cloudinary.uploader.distroy(image.publicId);
            await TempImage.findByIdAndDelete(image._id);
        }
    } catch (error) {
        console.log("Error in cleanupTempImages job", error.message);
    } { }
})