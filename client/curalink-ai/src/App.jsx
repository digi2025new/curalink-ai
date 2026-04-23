import { useState, useRef, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Message from "./components/Message";
import ResultCard from "./components/ResultCard";
import Header from "./components/Header";
import { streamQuery, sendQuery } from "./api";

function App() {
  const [messages, setMessages] = useState([]);
  const [query, setQuery] = useState("");
  const [disease, setDisease] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chatId, setChatId] = useState(null); // ✅ IMPORTANT FIX

  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!query || !disease) return alert("Enter disease & query");

    setMessages((prev) => [
      ...prev,
      { role: "user", content: query },
      { role: "assistant", content: "" },
    ]);

    setLoading(true);

    try {
      await streamQuery(query, disease, (text) => {
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: text,
          };
          return updated;
        });
      });

      const res = await sendQuery(query, disease, chatId, messages);

      if (!chatId) setChatId(res.chatId); // ✅ SESSION FIX

      setResult(res);
    } catch {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: "⚠️ Something went wrong",
        };
        return updated;
      });
    } finally {
      setLoading(false);
      setQuery("");
    }
  };

  // ✅ NEW CHAT RESET
  const handleNewChat = () => {
    setMessages([]);
    setResult(null);
    setChatId(null);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`
        fixed md:static z-50 h-full
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 transition-transform duration-300
      `}
      >
        <Sidebar setMessages={setMessages} setChatId={setChatId} />
      </div>

      {/* MAIN */}
      <div className="flex flex-col flex-1">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          onNewChat={handleNewChat}
        />

        {/* CHAT AREA */}
        <div
          className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4"
          style={{
            background: "linear-gradient(180deg, #F4FAF8, #E6F3EF)",
          }}
        >
          {messages.length === 0 && (
            <div className="text-center text-gray-500 mt-20">
              <h2 className="text-lg md:text-2xl font-semibold">
                🧠 AI Medical Assistant
              </h2>
            </div>
          )}

          {messages.map((msg, i) => (
            <Message key={i} {...msg} />
          ))}

          {loading && (
            <div className="flex gap-1 ml-2">
              <span className="w-2 h-2 bg-[#7CB5A6] rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-[#7CB5A6] rounded-full animate-bounce delay-100"></span>
              <span className="w-2 h-2 bg-[#7CB5A6] rounded-full animate-bounce delay-200"></span>
            </div>
          )}

          {result && <ResultCard data={result} />}

          <div ref={bottomRef} />
        </div>

        {/* INPUT */}
        <div
          className="
    sticky bottom-0 z-20
    p-3 md:p-4
    border-t
    bg-white/80 backdrop-blur
    flex flex-col md:flex-row gap-2 md:gap-3
  "
        >
          <input
            className="w-full md:w-1/4 border p-3 rounded-xl focus:ring-2 focus:ring-[#7CB5A6]"
            placeholder="Disease"
            value={disease}
            onChange={(e) => setDisease(e.target.value)}
          />

          <input
            className="flex-1 border p-3 rounded-xl focus:ring-2 focus:ring-[#7CB5A6]"
            placeholder="Ask medical query..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />

          <button
            onClick={handleSend}
            className="
      w-full md:w-auto px-6 py-3 rounded-xl text-white
      shadow hover:scale-105 transition
    "
            style={{ backgroundColor: "#7CB5A6" }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
