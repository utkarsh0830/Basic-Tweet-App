import express from 'express';
import {
    addComment,
    getComments,
    deleteComment,
} from '../controller/comments.controller.js';
import verifyJWT from '../middlewares/auth.js';

const router = express.Router();

router.post('/:tweetId', verifyJWT, addComment);
router.get('/:tweetId', getComments);
router.delete('/:commentId', verifyJWT, deleteComment);


export default router;
