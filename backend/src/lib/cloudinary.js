import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export function extractPublicId(cloudinaryUrl) {
    try {
        const url = new URL(cloudinaryUrl);
        const parts = url.pathname.split("/");
        const uploadIndex = parts.findIndex(part => part === "upload");
        let publicIdParts = parts.slice(uploadIndex + 1);

        if (/^v\d+$/.test(publicIdParts[0])) {
            publicIdParts.shift();
        }

        const filename = publicIdParts.pop().split(".")[0];
        publicIdParts.push(filename);

        return publicIdParts.join("/");
    } catch (err) {
        console.error("Failed to extract publicId:", err.message);
        return null;
    }
}


export default cloudinary;