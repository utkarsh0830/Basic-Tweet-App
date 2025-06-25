import mongoose from "mongoose";

import {Like} from '../model/like.js';
import { Tweet } from "../model/tweet.js";

const toogleTweetLike = async (req,res) => {
    const {tweetId} = req.params;

    if(!mongoose.isValidObjectId(tweetId)){
        res.status(400).json({
            message: "Invalid Tweet Id"
        })
    }

    const tweet = await Tweet.findById(tweetId);
    if(!tweet){
        res.status(404).json({
            message: "Tweet not found"
        })
    }

    const isAlredyLiked = await Like.findOne({
        tweet: tweetId,
        likedBy: req.user?._id
    });

    if(isAlredyLiked){
        await Like.findByIdAndDelete(isAlredyLiked?._id);
        return res.status(200).json({
            tweetId,
            isLiked: false,
            message: "Tweet unliked"
        })
        
    }

    await Like.create({
        tweet: tweetId,
        likedBy: req.user?._id
    });

    return res.status(201).json({ message: 'Tweet liked',isLiked: true, });

}


const getAllLikes = async (req,res) => {
    const {tweetId} = req.params;

    if(!mongoose.isValidObjectId(tweetId)){
        res.status(400).json({
            message: "Invalid Tweet Id"
        })
    }

    const likes = await Like.find({tweet:tweetId}).populate("likedBy","username");

    if(!likes){
        return res.status(404).json({
            message: "No likes found"
        })
    }
    return res.status(200).json(likes);
}

const getLikedTweetsByUser = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
        return res.status(400).json({ message: "User ID not found in request" });
        }

        const likes = await Like.find({ likedBy: userId }).populate("tweet", "content");

        if (!likes || likes.length === 0) {
        return res.status(404).json({ message: "No likes found" });
        }

        res.status(200).json({
            likedTweets: likes.map(l => l.tweet)
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

const getLikeCount = async (req, res) => {
    try {
        const tweetId = req.params.tweetId;

        const count = await Like.countDocuments({ tweet: tweetId });

        return res.status(200).json({ tweetId, likeCount: count });
    } catch (err) {
        return res.status(500).json({ message: 'Error counting likes', error: err.message });
    }
};



export {toogleTweetLike,getAllLikes,getLikedTweetsByUser,getLikeCount}