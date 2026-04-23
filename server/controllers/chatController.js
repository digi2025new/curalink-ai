import Chat from "../models/Chat.js";
import axios from "axios";

const AI_URL = "http://127.0.0.1:8000";

export const createChat = async (req, res) => {
  try {
    const { query, disease, chatId } = req.body;

    let chat = chatId ? await Chat.findById(chatId) : null;

    if (!chat) {
      chat = new Chat({ disease, messages: [] });
    }

    chat.messages.push({ role: "user", content: query });

    const aiRes = await axios.post(`${AI_URL}/process`, {
      query,
      disease
    });

    const answer = aiRes.data.answer;

    chat.messages.push({ role: "assistant", content: answer });

    chat.response = {
      publications: aiRes.data.publications,
      clinical_trials: aiRes.data.clinical_trials
    };

    await chat.save();

    res.json({
      chatId: chat._id,
      answer,
      publications: chat.response.publications,
      clinical_trials: chat.response.clinical_trials
    });

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

export const getChats = async (req, res) => {
  const chats = await Chat.find().sort({ createdAt: -1 });
  res.json(chats);
};

export const getChatById = async (req, res) => {
  const chat = await Chat.findById(req.params.id);
  res.json(chat);
};

export const deleteChat = async (req, res) => {
  await Chat.findByIdAndDelete(req.params.id);
  res.json({ msg: "Deleted" });
};