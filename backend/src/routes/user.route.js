import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js";
import { acceptFriendRequest, getMyFriends, getRecommendedUsers, sendFriendRequest, getFriendRequest, getOutgoingFriendRequest, deleteFriendRequest, deleteFriendRequests, rejectFriendRequest, updateProfile } from "../controllers/user.controller.js";

const router = express.Router();

router.use(protectRoute);

router.get('/', getRecommendedUsers);

router.get('/friends', getMyFriends);

router.post('/friend-request/:id', sendFriendRequest)

router.put('/friend-request/:id/accept', acceptFriendRequest)

router.put('/friend-request/:id/reject', rejectFriendRequest)

router.get('/friend-requests', getFriendRequest)

router.get('/outgoing-friend-requests', getOutgoingFriendRequest)

router.delete('/friend-request/:id', deleteFriendRequest)

router.delete('/friend-requests', deleteFriendRequests)

router.put('/update-profile', updateProfile)

export default router;