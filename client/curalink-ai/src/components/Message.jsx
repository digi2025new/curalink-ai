function Message({ role, content }) {
  const isUser = role === "user";

  return (
    <div
      className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`
          max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed
          shadow-sm transition-all duration-200
          ${isUser
            ? "bg-[#7CB5A6] text-white rounded-br-md"
            : "bg-white/80 backdrop-blur text-gray-800 rounded-bl-md border"}
        `}
      >
        {content || "Typing..."}
      </div>
    </div>
  );
}

export default Message;