import mongoose from "mongoose";

import { Tweet } from "../model/tweet.js";

const createTweet = async (req,res) => {
    const {content} = req.body;

    if(content === ""){
        res.status(400).json({
            message: "Content is required"
        })
    }

    const tweet = await Tweet.create({
        content,
        owner: req.user?._id
    });

    if(!tweet){
        res
        .status(500)
        .json({
            message: "failed to create tweet please try again"
        })
    }

    res.status(200).json({
        message: "Tweet created successfully",
        tweet
    });
}

const updateTweet = async (req,res) => {
    const {content} = req.body;
    const {tweetId} = req.params;

    if(!mongoose.isValidObjectId(tweetId)){
        res.status(400).json({
            message: "Invalid TweetId"
        })
    }

    const tweet = await Tweet.findById(tweetId);
    if(!tweet){
        res.status(401).json({
            message: "Tweet not found"
        })
    }

    if(tweet.owner.toString() !== req.user._id.toString()){
        res.status(401).json({
            message: "You are not the owner of this tweet"
        })
    }

    const newTweet = await Tweet.findByIdAndUpdate(tweetId,
        {
            $set: {
                content
            }
        },
        {new: true}
    );

    if(!tweet){
        res.status(500).json({
            message: "Failed to edit tweet, please try again"
        })
    }
    return res.status(200).json(
        {
            message: "Tweet updated successfully",
            newTweet
        }
    );

}

const deleteTweet = async (req,res) => {
    const {tweetId} = req.params;
    if(!mongoose.isValidObjectId(tweetId)){
        res.status(400).json({
            message: "Invalid TweetId"
        })
    }
    const tweet = await Tweet.findById(tweetId);
    if(!tweet){
        res.status(401).json({
            message: "Tweet not found"
        })
    }

    if (!tweet || !tweet.owner || !req.user || !req.user._id) {
        return res.status(400).json({ message: "Invalid data for authorization check." });
    }

    if (tweet.owner.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Unauthorized: You can't delete this tweet." });
    }
    await Tweet.findByIdAndDelete(tweetId);

    return res.status(200).json({
        message:"Tweet Deleted Successfully",
        tweetId
    });
    
}

const getUserTweet = async (req,res) => {
    const userId = req.user._id;

    if(!mongoose.isValidObjectId(userId)){
        res.status(400).json({
            message: "Invalid TweetId"
        })
    }

    const tweet = await Tweet.find({
        owner:userId
    }).sort({createdAt : -1});

    res.status(200).json({
        tweet,
        message: "User Tweet Fetched Successfully"
    });
}

const getAllTweet = async (req,res) => {
    const tweet = await Tweet.find().populate("owner","username name").sort({createdAt: -1}).lean();
    if(!tweet){
        res.json(401).json({
            message : "No tweet created yet.",
        })
    }
    res.status(200).json({
        message: "All Tweet Fetched Successfully",
        tweet
    });
}
export {createTweet,deleteTweet,updateTweet,getUserTweet,getAllTweet}