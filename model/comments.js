import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    tweet: { type: mongoose.Schema.Types.ObjectId, ref: 'Tweet', required: true },
    gifUrl: { type: String },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String,
        required: function () {
            
            return !this.gifUrl;
        },
        }
},{timestamps:true});

export const Comment = mongoose.model('Comment', commentSchema);
