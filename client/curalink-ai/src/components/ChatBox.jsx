// import { useState } from "react";

// export default function ChatBox({ onSend }) {
//   const [query, setQuery] = useState("");
//   const [disease, setDisease] = useState("");

//   const handleSubmit = () => {
//     if (!query || !disease) return;

//     onSend(query, disease);
//     setQuery("");
//   };

//   return (
//     <div className="p-4 bg-white flex gap-2">
//       <input
//         className="border p-2 w-1/3 rounded"
//         placeholder="Enter disease"
//         value={disease}
//         onChange={(e) => setDisease(e.target.value)}
//       />

//       <input
//         className="border p-2 flex-1 rounded"
//         placeholder="Ask your question..."
//         value={query}
//         onChange={(e) => setQuery(e.target.value)}
//       />

//       <button
//         onClick={handleSubmit}
//         className="bg-blue-500 text-white px-4 rounded"
//       >
//         Send
//       </button>
//     </div>
//   );
// }