import express from 'express';
import dotenv from "dotenv";
dotenv.config();
const app = express();

import connectDB from "./db/index.js";
import { Tweet } from './model/tweet.js'; // ✅ import Tweet model
import userRoutes from "./routes/user.route.js";
import cookieParser from 'cookie-parser';
import tweetRoutes from './routes/tweet.route.js';
import likesRoutes from './routes/likes.route.js';
import commentRoutes from './routes/comments.route.js';

const PORT = 4800;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("✅ API is running...");
});

app.use("/api/v1", userRoutes);
app.use("/api/v1/tweets", tweetRoutes);
app.use('/api/v1/likes', likesRoutes);
app.use('/api/v1/comments', commentRoutes);

connectDB()
  .then(async () => {
    
    const result = await Tweet.updateMany(
      { createdAt: { $exists: false } },
      { $set: { createdAt: new Date('2024-01-01') } }
    );
    if (result.modifiedCount > 0) {
      console.log(`🛠 Fixed ${result.modifiedCount} tweet(s) missing createdAt.`);
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MONGO DB connection failed!", err);
  });
