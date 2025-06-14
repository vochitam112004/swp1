import React, { useState } from "react";

const ChatSupport = () => {
  const [messages, setMessages] = useState([
    { from: "support", text: "Xin chào! Tôi có thể giúp gì cho bạn?" },
  ]);
  const [input, setInput] = useState("");

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages([...messages, { from: "user", text: input }]);
    setInput("");
    // Ở đây bạn có thể tích hợp API chat thực tế hoặc trả lời tự động
    setTimeout(() => {
      setMessages((msgs) => [
        ...msgs,
        { from: "support", text: "Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm." },
      ]);
    }, 1000);
  };

  return (
    <div style={{
      position: "fixed",
      bottom: 24,
      right: 24,
      width: 320,
      background: "#fff",
      borderRadius: 12,
      boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
      zIndex: 9999,
      overflow: "hidden",
      display: "flex",
      flexDirection: "column"
    }}>
      <div style={{ background: "#1976d2", color: "#fff", padding: "12px 16px", fontWeight: 600 }}>
        Hỗ trợ trực tuyến
      </div>
      <div style={{ flex: 1, padding: 16, maxHeight: 300, overflowY: "auto" }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{
            textAlign: msg.from === "user" ? "right" : "left",
            marginBottom: 8
          }}>
            <span style={{
              display: "inline-block",
              background: msg.from === "user" ? "#e3f2fd" : "#f1f1f1",
              color: "#222",
              borderRadius: 8,
              padding: "6px 12px",
              maxWidth: "80%",
              wordBreak: "break-word"
            }}>
              {msg.text}
            </span>
          </div>
        ))}
      </div>
      <form onSubmit={handleSend} style={{ display: "flex", borderTop: "1px solid #eee" }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Nhập tin nhắn..."
          style={{ flex: 1, border: "none", padding: 12, outline: "none" }}
        />
        <button type="submit" style={{
          background: "#1976d2",
          color: "#fff",
          border: "none",
          padding: "0 16px",
          cursor: "pointer"
        }}>Gửi</button>
      </form>
    </div>
  );
};

export default ChatSupport;