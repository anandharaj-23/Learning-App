import User from "../models/User.js";
import FriendRequest from "../models/FriendRequest.js";

export async function getRecommendedUsers(req,res) {
    try{
        const currentUserId = req.user.id;
        const currentUser = req.user;

        const recommendedUsers = await User.find({
            $and : [
                { _id : { $ne :currentUserId}},
                {_id : { $nin : currentUser.friends}},
                {isOnboarded : true}
            ],
        });
        
        res.status(200).json(recommendedUsers);
    }

    catch(error)
    {
        console.error("Error in getRecommended Users Controller",error);
        res.staus(500).json({message:"Internal Server Error"});
    }
}

export async function getMyFriends(req,res){
    try{
        const user = await User.findById(req.user.id)
        .select("friends")
        .populate("friends","fullName profilePic nativeLanguage learningLanguage location");

        res.status(200).json(user.friends);
    }

    catch(error)
    {
        console.error("Error in getFriends Controller",error);
        res.status(500).json({message:"Internal Server Error"});
    }
}

export async function sendFriendRequest(req,res){
    try{
        const myId = req.user.id;
        const {id:recipientId} = req.params;

        if(myId == recipientId)
        {
            return res.status(400).json({message : "You cannot send a friend request to yourself"});
        }

        const recipient = await User.findById(recipientId);

        if(!recipient)
        {
            return res.status(404).json({message:"Recipient Not Found"});
        }

        //check if user is already Friends

        if(recipient.friends.includes(myId))
        {
            return res.status(400).json({message:"You are already friends with this user"});
        }

        //check if friend request is already sent
        const existingRequest = await FriendRequest.findOne({
            $or :[
                {sender:myId,recipient:recipientId},
                {sender:recipientId,recipient:myId},
            ],
        });

        if(existingRequest)
        {
            return res
            .status(400)
            .json({message:"Friend request already exists between you and this user"});
        }

        const friendRequest = await FriendRequest.create({
            sender:myId,
            recipient:recipientId,
        });

        res.status(201).json(friendRequest)

    }

    catch(error)
    {
        console.error("Error in sendFriendRequest Controller",error);
        res.status(500).json({message:"Internal Server Error"});
    }
}

export async function acceptFriendRequest(req,res){
    try{
        const {id : requestId} = req.params;

        const friendrequest = await FriendRequest.findById(requestId);

        if(!friendrequest)
        {
            return res.status(404).json({message:"Friend Request Not Found"});
        }

        if(friendrequest.recipient.toString() !== req.user.id)
        {
            return res.status(403).json({message:"You are not authorized to accept this friend request"});
        }

        friendrequest.status = "accepted";
        await friendrequest.save();

        await User.findByIdAndUpdate(friendrequest.sender,
            {$addToSet:{ friends: friendrequest.recipient}
        });

        await User.findByIdAndUpdate(friendrequest.recipient,
            {$addToSet:{ friends: friendrequest.sender}
        });

        res.status(200).json({message:"Friend Request Accepted Successfully"});
    }

    catch(error)
    {
        console.error("Error in acceptFriendRequest Controller",error);
        res.status(500).json({message:"Internal Server Error"});
    }
}

export async function getFriendRequests(req,res){
    try{
        const incomingReqs = await FriendRequest.find({
            recipient :req.user.id,
            status : "pending",
        }).populate("sender","fullName profilePic nativeLanguage learningLanguage");

        const acceptedReqs = await FriendRequest.find({
            sender : req.user.id,
            status : "accepted",
        }).populate("recipient","fullName profilePic");

        res.status(200).json({incomingReqs,acceptedReqs});
    }

    catch(error)
    {
        console.error("Error in getFriendRequests Controller",error);
        res.status(500).json({message:"Internal Server Error"});
    }

}

export async function getOutgoingFriendReqs(req,res){
    try{
        const outgoingRequests = await FriendRequest.find({
            sender : req.user.id,
            status : "pending",
        }).populate("recipient","fullName profilePic nativeLanguage learningLanguage");

        res.status(200).json(outgoingRequests);
    }

    catch(error)
    {
        console.error("Erroe in getOutgoingFriendReqs Controller",error);
        res.status(500).json({message:"Internal Server Error"});
    }
}
