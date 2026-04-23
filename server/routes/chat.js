import express from "express";
import axios from "axios";
import Chat from "../models/Chat.js";

const router = express.Router();
const AI_URL = "http://127.0.0.1:8000";

// ----------------------------
// CREATE / CONTINUE CHAT
// ----------------------------
router.post("/", async (req, res) => {
  try {
    const { query, disease } = req.body;

    if (!query || !disease) {
      return res.status(400).json({ error: "Missing input" });
    }

    const chat = new Chat({
      disease,
      messages: [{ role: "user", content: query }]
    });

    const aiRes = await axios.post(`${AI_URL}/process`, {
      query,
      disease,
      context: [],
    });

    const answer = aiRes.data?.answer || "Response generated";

    chat.messages.push({ role: "assistant", content: answer });

    chat.response = {
      publications: aiRes.data.publications || [],
      clinical_trials: aiRes.data.clinical_trials || [],
    };

    await chat.save();

    res.json({
      chatId: chat._id,
      answer,
      publications: chat.response.publications,
      clinical_trials: chat.response.clinical_trials,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


// ----------------------------
// GET ALL CHATS (🔥 REQUIRED)
// ----------------------------
router.get("/", async (req, res) => {
  try {
    const chats = await Chat.find()
      .sort({ createdAt: -1 })
      .select("_id disease createdAt");

    res.json(chats);
  } catch {
    res.status(500).json({ error: "Failed to fetch chats" });
  }
});


// ----------------------------
// GET SINGLE CHAT (🔥 REQUIRED)
// ----------------------------
router.get("/:id", async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);

    if (!chat) return res.status(404).json({ error: "Not found" });

    res.json(chat);
  } catch {
    res.status(500).json({ error: "Error fetching chat" });
  }
});


// ----------------------------
// DELETE CHAT (🔥 REQUIRED)
// ----------------------------
router.delete("/:id", async (req, res) => {
  try {
    await Chat.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch {
    res.status(500).json({ error: "Delete failed" });
  }
});

export default router;