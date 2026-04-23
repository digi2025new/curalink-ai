import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

import chatRoutes from "./routes/chat.js";

const app = express();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ MongoDB Connection (robust)
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000,
})
.then(() => console.log("✅ MongoDB Connected"))
.catch((err) => {
  console.error("❌ MongoDB Connection Failed:", err.message);
});

// ✅ Routes
app.use("/api/chat", chatRoutes);

// ✅ Health Check
app.get("/", (req, res) => {
  res.send("🚀 API is running...");
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});