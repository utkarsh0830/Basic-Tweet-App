import { createTweet,updateTweet,deleteTweet, getUserTweet, getAllTweet } from "../controller/tweet.controller.js";
import { Router } from "express";
import verifyJWT from "../middlewares/auth.js";

const router = new Router();

router.post("/",verifyJWT, createTweet);
router.post('/updateTweet/:tweetId',verifyJWT,updateTweet);
router.post("/deleteTweet/:tweetId",verifyJWT,deleteTweet);
router.get('/getUserTweet',verifyJWT,getUserTweet);
router.get("/getAllTweet",verifyJWT,getAllTweet);

export default router;