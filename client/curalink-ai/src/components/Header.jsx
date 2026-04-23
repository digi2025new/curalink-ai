import logo from "../assets/logo.png";

function Header({ onMenuClick, onNewChat }) {
  return (
    <div
      className="flex items-center justify-between px-4 py-3"
      style={{
        background: "linear-gradient(90deg, #7CB5A6, #5A9C8C)"
      }}
    >

      <div className="flex items-center gap-3">

        <button onClick={onMenuClick} className="md:hidden text-white text-xl">
          ☰
        </button>

        <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow">
          <img src={logo} className="w-10 h-10 object-contain" />
        </div>

        <h1 className="text-white font-semibold text-lg">
          Curalink AI
        </h1>
      </div>

      {/* ✅ NEW CHAT BUTTON */}
      <button
        onClick={onNewChat}
        className="bg-white text-[#5A9C8C] px-4 py-2 rounded-lg text-sm font-medium"
      >
        + New Chat
      </button>

    </div>
  );
}

export default Header;