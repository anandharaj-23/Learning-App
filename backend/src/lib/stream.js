import {StreamChat} from "stream-chat";
import "dotenv/config";

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if(!apiKey || !apiSecret)
{
    console.error("Stream API Key or Secret is missing");
}

const StreamClient =  StreamChat.getInstance(apiKey,apiSecret);

export const upsertStreamUser = async (userData) => {
    try{
        await StreamClient.upsertUsers([userData]);
        return userData;
    }

    catch(error)
    {
        console.error("Error upserting stream user",error);
        return null;
    }
}

export const generateStreamToken = (userId) => {
    try{
        const userIdStr = userId.toString();
        return StreamClient.createToken(userIdStr);
    }

    catch(error)
    {
        console.error("Error generating stream token",error);
    }
};