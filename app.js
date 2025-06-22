
import express from 'express';
import dotenv from "dotenv"
const app = express();
import connectDB from "./db/index.js";

const PORT = process.env.PORT || 8000;

app.get('/', (req, res) => {
    res.json({ 1: "Service Started Successfully" });
});

app.get('/users', (req, res) => {
    res.json([
        { id: 1, name: "John" },
        { id: 2, name: "Rohit" },
        { id: 3, name: "Aman" }
    ]);
});

dotenv.config();

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MONGO DB connection failed!", err);
  });
