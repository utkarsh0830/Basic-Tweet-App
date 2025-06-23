
import express from 'express';
import dotenv from "dotenv";
dotenv.config();
const app = express();
import connectDB from "./db/index.js";
import userRoutes from "./routes/user.route.js";
import cookieParser from 'cookie-parser';

const PORT = process.env.PORT || 5000;

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


app.use("/api/v1/",userRoutes);


connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MONGO DB connection failed!", err);
  });

