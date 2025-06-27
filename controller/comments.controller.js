import { Comment } from '../model/comments.js';
import { Tweet } from '../model/tweet.js';
import mongoose from 'mongoose';

export const addComment = async (req, res) => {
    const { tweetId } = req.params;
    const { content, gifUrl } = req.body;

    if (!mongoose.isValidObjectId(tweetId) || (!content && !gifUrl)) {
        return res.status(400).json({ message: 'Invalid input' });
    }

    const tweet = await Tweet.findById(tweetId);
    if (!tweet) return res.status(404).json({ message: 'Tweet not found' });

    const comment = await Comment.create({
        tweet: tweetId,
        author: req.user._id,
        content,
        gifUrl,
    });

    const populatedComment = await comment.populate('author', 'username name');

    return res.status(201).json(populatedComment);
};

export const getComments = async (req, res) => {
    const { tweetId } = req.params;

    if (!mongoose.isValidObjectId(tweetId)) {
        return res.status(400).json({ message: 'Invalid tweet ID' });
    }

    const comments = await Comment.find({ tweet: tweetId })
        .populate('author', 'username name')
        .sort({ createdAt: -1 })
        .lean();

    res.json({ comments });
};

export const deleteComment = async (req, res) => {
    const { commentId } = req.params;

    if (!mongoose.isValidObjectId(commentId)) {
        return res.status(400).json({ message: 'Invalid comment ID' });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    if (comment.author.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Unauthorized to delete this comment' });
    }

    await Comment.findByIdAndDelete(commentId);

    res.status(200).json({ message: 'Comment deleted' });
};
