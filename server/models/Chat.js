import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    disease: String,
    messages: [
      {
        role: String,
        content: String,
      },
    ],
    response: {
      publications: Array,
      clinical_trials: Array,
    },
  },
  { timestamps: true } // ✅ IMPORTANT
);

export default mongoose.model("Chat", chatSchema);