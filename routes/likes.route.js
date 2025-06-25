import verifyJWT from "../middlewares/auth.js"
import { Router } from "express";
const router = Router();
import {toogleTweetLike,getAllLikes,getLikedTweetsByUser, getLikeCount} from "../controller/like.controller.js"

router.post('/:tweetId', verifyJWT,toogleTweetLike);

router.get('/getAlllikes/:tweetId', getAllLikes);

router.get('/getUserLikedTweet',verifyJWT,getLikedTweetsByUser);

router.get('/getLikeCount/:tweetId',getLikeCount);

export default router