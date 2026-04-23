const BASE_URL = "http://localhost:5000/api/chat";

export const sendQuery = async (query, disease, chatId, history) => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, disease, chatId, history }),
  });

  return res.json();
};

export const streamQuery = async (query, disease, onData) => {
  const response = await fetch("http://localhost:8000/stream", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, disease }),
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  let text = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    text += decoder.decode(value);
    onData(text);
  }
};