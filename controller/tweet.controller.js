import mongoose from "mongoose";
import { User } from "../model/user";
import { Tweet } from "../model/tweet";

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

    const tweet = Tweet.findById(tweetId);
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
    res.status(200).json(
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
    const tweet = Tweet.findById(tweetId);
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
    await Tweet.findByIdAndDelete(tweetId);

    res.status(200).json({
        message:"Tweet Deleted Successfully",
        tweetId
    });
    
}

export {createTweet,deleteTweet,updateTweet}