import { StreamChat } from "stream-chat"

const apiKey = process.env.STEAM_API_KEY;
const apiSecret = process.env.STEAM_API_SECRET;

if (!apiKey || !apiSecret) {
    console.error("Stream API key or Secret is missing")
}

const streamClient = StreamChat.getInstance(apiKey, apiSecret);

export const upsertStreamUser = async (userData) => {
    try {
        await streamClient.upsertUsers([userData]);
        return userData;
    } catch (error) {
        console.error("Error upserting Stream user:", error);
    }
}

export const generateStreamToken = (userId) => {
    try {
        const userIdstring = userId.toString();
        return streamClient.createToken(userIdstring);
    } catch (error) {
        console.error("Error generating Stream token:", error);
    }
}