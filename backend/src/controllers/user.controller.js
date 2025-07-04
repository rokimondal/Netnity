import FriendRequest from "../models/FriendRequest.js";
import User from "../models/User.js";

export async function getRecommendedUsers(req, res) {
    try {
        const currentUser = req.user;
        const recommendedUsers = await User.find({
            $and: [
                { _id: { $ne: currentUser._id } },
                { _id: { $nin: currentUser.friends } },
                { emailVerified: true },
                { isOnboarded: true }
            ]
        });
        res.status(200).json(recommendedUsers);
    } catch (error) {
        console.log("Error in getRecommendedUsers controller", error.message);
        res.status(500).json({ message: "Internal server error" });
    }

}

export async function getMyFriends(req, res) {
    try {
        const user = await User.findById(req.user._id).select("friends").populate("friends", "fullName profilePic nativeLanguage learningLanguage")
        res.status(200).json(user.friends);
    } catch (error) {
        console.log("Error in getMyFriends controller", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function sendFriendRequest(req, res) {
    try {
        const myId = req.user._id;
        const { id: recipientId } = req.params;
        if (myId.toString() === recipientId) {
            return res.status(400).json({ message: "You cannot send a friend request to yourself" });
        }

        const recipient = await User.findById(recipientId);
        if (!recipient) {
            return res.status(404).json({ message: "recipient not found" });
        }

        if (recipient.friends.includes(myId)) {
            return res.status(400).json({ message: "You are already friends with this user" })
        }

        const existingRequest = await FriendRequest.findOne({
            $or: [
                { sender: myId, recipient: recipientId },
                { sender: recipientId, recipient: myId },
            ]
        })
        if (existingRequest) {
            return res.status(400).json({ message: 'A friend request already exists between you and this user' })
        }

        const friendRequest = await FriendRequest.create({
            sender: myId,
            recipient: recipientId
        })

        res.status(201).json(friendRequest)
    } catch (error) {
        console.log("Error in sendFriendRequest controller", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function acceptFriendRequest(req, res) {
    try {
        const { id: requestId } = req.params;
        const friendRequest = await FriendRequest.findById(requestId);
        if (!friendRequest) {
            return res.status(404).json({ message: 'Friend request not found' });
        }

        if (friendRequest.recipient.toString() != req.user._id.toString()) {
            return res.status(403).json({ message: 'You are not authorized to accept this request' });
        }

        friendRequest.status = "accepted";

        await friendRequest.save();

        await User.findByIdAndUpdate(friendRequest.sender, {
            $addToSet: { friends: friendRequest.recipient }
        });

        await User.findByIdAndUpdate(friendRequest.recipient, {
            $addToSet: { friends: friendRequest.sender }
        });
        res.status(200).json({ message: "Friend request accepted" })
    } catch (error) {
        console.log("Error in acceptFriendRequest controller", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function rejectFriendRequest(req, res) {
    try {
        const { id: requestId } = req.params;
        const friendRequest = await FriendRequest.findOne({
            _id: requestId,
            recipient: req.user._id,
            status: "pending"
        });
        if (!friendRequest) {
            return res.status(404).json({ message: 'Friend request not found' });
        }
        friendRequest.status = "rejected";
        await friendRequest.save();
        res.status(200).json({ message: "Friend request rejected" });

    } catch (error) {
        console.log("Error in rejectFriendRequest controller", error.message);
        res.status(500).json({ message: "Internal server error" });

    }
}

export async function getFriendRequest(req, res) {
    try {
        const incomingRequests = await FriendRequest.find({
            recipient: req.user._id,
            status: "pending"
        }).populate("sender", "fullName profilePic nativeLanguage learningLanguage")

        const acceptedRequests = await FriendRequest.find({
            sender: req.user._id,
            status: "accepted"
        }).populate("recipient", "fullName profilePic nativeLanguage learningLanguage")
        res.status(200).json({ incomingRequests, acceptedRequests })
    } catch (error) {
        console.log("Error in getFriendRequest controller", error.message);
        res.status(500).send("Internal server error")
    }
}

export async function getOutgoingFriendRequest(req, res) {
    try {
        const outgoingRequests = await FriendRequest.find({
            sender: req.user._id,
            status: "pending"
        }).populate("recipient", "fullName profilePic nativeLanguage learningLanguage");
        res.status(200).json(outgoingRequests);
    } catch (error) {
        console.log("Error in getOutgoingFriendRequest controller", error.message);
        res.status(500).send("Internal server error")
    }
}

export async function deleteFriendRequest(req, res) {
    try {
        const userId = req.user._id;
        const { id: friendRequestId } = req.params
        const result = await FriendRequest.deleteOne({
            $and: [
                { _id: friendRequestId },
                {
                    $or: [
                        { sender: userId },
                        { recipient: userId }
                    ]
                }
            ]
        });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Friend request not found or you are not authorized to delete it" });
        }
        res.status(200).json({ message: "Friend request deleted successfully" });
    } catch (error) {
        console.log("Error in deleteFriendRequest controller", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function deleteFriendRequests(req, res) {
    try {
        const userId = req.user._id;
        const { ids } = req.body;
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ message: "No ids provided" });
        }
        const result = await FriendRequest.deleteMany({
            $and: [
                { _id: { $in: ids } },
                {
                    $or: [
                        { sender: userId },
                        { recipient: userId }
                    ]
                }
            ]
        });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "No friend requests found to delete" });
        }
        res.status(200).json({ message: `${result.deletedCount} friend requests deleted successfully` });
    } catch (error) {
        console.log("Error in deleteFriendRequests controller", error.message);
        res.status(500).json({ message: "Internal server error" });
    }

}