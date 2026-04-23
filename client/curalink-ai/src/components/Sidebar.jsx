import React, { useState, useEffect } from "react";
import logo from "../assets/logo.png";

function Sidebar({ setMessages, setChatId }) {
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/chat");
        const data = await res.json();
        setChats(Array.isArray(data) ? data : []);
      } catch {
        setChats([]);
      }
    };

    fetchChats();
  }, []);

  const loadChat = async (id) => {
    const res = await fetch(`http://localhost:5000/api/chat/${id}`);
    const data = await res.json();

    setActiveChat(id);
    setMessages(data.messages || []);
    setChatId(id); // ✅ IMPORTANT
  };

  const deleteChat = async (id, e) => {
    e.stopPropagation();

    await fetch(`http://localhost:5000/api/chat/${id}`, {
      method: "DELETE",
    });

    setChats(prev => prev.filter(c => c._id !== id));

    if (activeChat === id) {
      setMessages([]);
      setChatId(null);
    }
  };

  return (
    <div className="w-72 h-full flex flex-col p-4 shadow-xl"
      style={{ background: "linear-gradient(180deg, #EAF4F1, #CFE5DE)" }}
    >

      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <img src={logo} className="w-14 h-14 rounded-full bg-white p-1" />
        <div>
          <h2 className="font-bold">Curalink AI</h2>
          <p className="text-xs text-gray-500">Chat History</p>
        </div>
      </div>

      {/* Chats */}
      <div className="flex-1 overflow-y-auto space-y-2">

        {chats.map(chat => (
          <div
            key={chat._id}
            onClick={() => loadChat(chat._id)}
            className="p-3 rounded-xl flex justify-between cursor-pointer"
            style={{
              background:
                activeChat === chat._id
                  ? "#DDF1EC"
                  : "rgba(255,255,255,0.7)"
            }}
          >
            <span>{chat.disease}</span>

            <button onClick={(e) => deleteChat(chat._id, e)}>
              🗑
            </button>
          </div>
        ))}

      </div>
    </div>
  );
}

export default Sidebar;