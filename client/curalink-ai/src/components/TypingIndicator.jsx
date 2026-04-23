const TypingIndicator = () => {
  return (
    <div className="flex items-center gap-2 text-gray-400">
      🤖 Typing
      <div className="flex gap-1">
        <span className="animate-bounce">.</span>
        <span className="animate-bounce delay-100">.</span>
        <span className="animate-bounce delay-200">.</span>
      </div>
    </div>
  );
};

export default TypingIndicator;