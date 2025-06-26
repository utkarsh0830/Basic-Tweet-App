
import express from 'express';
import dotenv from "dotenv";
dotenv.config();
const app = express();
import connectDB from "./db/index.js";
import userRoutes from "./routes/user.route.js";
import cookieParser from 'cookie-parser';
import tweetRoutes from './routes/tweet.route.js';
import likesRoutes from './routes/likes.route.js';

const PORT = 4900;

// app.get('/', (req, res) => {
//     res.json({ 1: "Service Started Successfully" });
// });x

// app.get('/users', (req, res) => {
//     res.json([
//         { id: 1, name: "John" },
//         { id: 2, name: "Rohit" },
//         { id: 3, name: "Aman" }
//     ]);
// });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());



app.get("/", (req, res) => {
  res.send("✅ API is running...");
});


app.use("/api/v1",userRoutes);
app.use("/api/v1/tweets", tweetRoutes);
app.use('/api/v1/likes',likesRoutes)



connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MONGO DB connection failed!", err);
  });

