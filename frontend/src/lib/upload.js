import axios from "axios";

export const uploadImage = async ({ file, secret }) => {
    try {
        const fileData = new FormData();
        fileData.append("file", file);
        fileData.append("api_key", secret.apiKey);
        fileData.append("timestamp", secret.timestamp);
        fileData.append("signature", secret.signature);
        fileData.append("public_id", secret.publicId);
        const response = await axios.post(`https://api.cloudinary.com/v1_1/${secret.cloudName}/image/upload`, fileData)
        return response.data;
    } catch (error) {
        throw error;
    }
}