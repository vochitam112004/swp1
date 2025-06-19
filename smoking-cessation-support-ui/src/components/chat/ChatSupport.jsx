import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import { toast } from "react-toastify";

const getUserRole = () => {
  // Lấy role từ localStorage hoặc context, ví dụ:
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return user.role || "user"; // "coach" hoặc "user"
};

const ChatSupport = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const role = getUserRole();

  // Lấy lịch sử chat khi load
  useEffect(() => {
    api.get("/chat/history")
      .then(res => setMessages(res.data))
      .catch(() => setMessages([
        { from: "support", text: "Xin chào! Tôi có thể giúp gì cho bạn?" }
      ]));
  }, []);

  // Gửi tin nhắn
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const newMsg = { from: role, text: input };
    setMessages(msgs => [...msgs, newMsg]);
    setInput("");
    setLoading(true);
    try {
      const res = await api.post("/chat/send", newMsg);
      if (res.data.reply) {
        setMessages(msgs => [...msgs, { from: "coach", text: res.data.reply }]);
        toast.success("Đã gửi tin nhắn!");
      }
    } catch {
      setMessages(msgs => [...msgs, { from: "support", text: "Không gửi được tin nhắn. Vui lòng thử lại." }]);
      toast.error("Không gửi được tin nhắn. Vui lòng thử lại!");
    }
    setLoading(false);
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
        {role === "coach" ? "Hộp thư huấn luyện viên" : "Hỗ trợ trực tuyến"}
      </div>
      <div style={{ flex: 1, padding: 16, maxHeight: 300, overflowY: "auto" }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{
            textAlign: msg.from === role ? "right" : "left",
            marginBottom: 8
          }}>
            <span style={{
              display: "inline-block",
              background: msg.from === "user" ? "#e3f2fd" : msg.from === "coach" ? "#ffe082" : "#f1f1f1",
              color: "#222",
              borderRadius: 8,
              padding: "6px 12px",
              maxWidth: "80%",
              wordBreak: "break-word"
            }}>
              <b>{msg.from === "coach" ? "Huấn luyện viên" : msg.from === "user" ? "Bạn" : "Hệ thống"}:</b> {msg.text}
            </span>
          </div>
        ))}
      </div>
      <form onSubmit={handleSend} style={{ display: "flex", borderTop: "1px solid #eee" }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={loading ? "Đang gửi..." : "Nhập tin nhắn..."}
          style={{ flex: 1, border: "none", padding: 12, outline: "none" }}
          disabled={loading}
        />
        <button type="submit" style={{
          background: "#1976d2",
          color: "#fff",
          border: "none",
          padding: "0 16px",
          fontWeight: 600,
          cursor: loading ? "not-allowed" : "pointer"
        }} disabled={loading}>Gửi</button>
      </form>
    </div>
  );
};

export default ChatSupport;