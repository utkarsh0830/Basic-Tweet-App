import mongoose from "mongoose";

import { Tweet } from "../model/tweet.js";
import { Like } from "../model/like.js";

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

const updateTweet = async (req, res) => {
    const { content } = req.body;
    const { tweetId } = req.params;

    if (!mongoose.isValidObjectId(tweetId)) {
        return res.status(400).json({ message: "Invalid TweetId" });
    }

    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
        return res.status(404).json({ message: "Tweet not found" });
    }

    if (tweet.owner.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "You are not the owner of this tweet" });
    }

    // Only update content — don't modify createdAt manually!
    const updatedTweet = await Tweet.findByIdAndUpdate(
        tweetId,
        { $set: { content } },
        { new: true }
    );

    return res.status(200).json({
        message: "Tweet updated successfully",
        tweet: updatedTweet,
    });
};


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

const getUserTweet = async (req, res) => {
    const userId = req.user._id;

    if (!mongoose.isValidObjectId(userId)) {
        return res.status(400).json({
            message: "Invalid TweetId"
        });
    }

    const tweet = await Tweet.find({ owner: userId })
        .populate('owner', 'username name') // 👈 populate user info
        .sort({ createdAt: -1 });

    res.status(200).json({
        tweet,
        message: "User Tweet Fetched Successfully"
    });
};


const getAllTweet = async (req, res) => {
  try {
    // 1) Ensure we know who’s asking
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized: no user.' });
    }

    // 2) Fetch and populate owner
    const tweets = await Tweet.find()
      .populate('owner', 'username name')
      .sort({ createdAt: -1 })
      .lean();

    // 3) Enrich with likeCount & isLiked
    const enriched = await Promise.all(
      tweets.map(async (t) => {
        const likeCount = await Like.countDocuments({ tweet: t._id });
        const isLiked = await Like.exists({ tweet: t._id, likedBy: userId });
        return {
          ...t,
          likeCount,
          isLiked: !!isLiked,
        };
      })
    );

    // 4) Always return an array (even if empty)
    return res.status(200).json({
      message: 'All Tweet Fetched Successfully',
      tweet: enriched,
    });
  } catch (err) {
    console.error('getAllTweet error:', err);
    return res.status(500).json({
      message: 'Server error',
      error: err.message,
    });
  }
};

export {createTweet,deleteTweet,updateTweet,getUserTweet,getAllTweet}