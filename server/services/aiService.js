import axios from "axios";

export const processQuery = async (query, disease, history) => {
  try {
    const res = await axios.post("http://127.0.0.1:8000/process", {
      query,
      disease,
      history, // 🔥 send context to AI
    });

    return res.data;

  } catch (error) {
    console.error("AI Service Error:", error.message);
    return {
      answer: "AI service failed",
      publications: [],
      clinical_trials: [],
    };
  }
};