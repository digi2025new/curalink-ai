import { useState } from "react";
import { sendQuery } from "../api";
import ChatBox from "../components/ChatBox";
import Message from "../components/Message";
import ResultCard from "../components/ResultCard";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async (query, disease) => {
    const userMsg = { role: "user", content: query };
    setMessages((prev) => [...prev, userMsg]);

    try {
      setLoading(true);

      const res = await sendQuery(query, disease);

      const botMsg = {
        role: "assistant",
        content: res.ai_response || "No response",
        data: res,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error("API Error:", err);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "⚠️ Something went wrong. Try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      
      {/* HEADER */}
      <div className="bg-white shadow p-4 text-center font-bold text-xl">
        🧠 Curalink AI Medical Assistant
      </div>

      {/* CHAT */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg, i) => (
          <div key={i}>
            <Message role={msg.role} content={msg.content} />
            {msg.data && <ResultCard data={msg.data} />}
          </div>
        ))}

        {loading && (
          <div className="text-center text-gray-500 mt-4">
            ⏳ Thinking...
          </div>
        )}
      </div>

      {/* INPUT */}
      <ChatBox onSend={handleSend} />
    </div>
  );
}