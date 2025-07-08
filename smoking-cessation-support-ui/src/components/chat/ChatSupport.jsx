import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import { toast } from "react-toastify";

const getUserRole = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  return user.role || "user"; // "coach" hoặc "user"
};

const getMessageColor = (from) => {
  if (from === "user") return "#e3f2fd";
  if (from === "coach") return "#fff3cd";
  return "#f1f1f1";
};

const getSenderLabel = (from) => {
  if (from === "coach") return "Huấn luyện viên";
  if (from === "user") return "Bạn";
  return "Hệ thống";
};


const ChatSupport = ({ targetUserId, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const role = getUserRole();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const url =
          role === "coach" && targetUserId
            ? `/chat/history/${targetUserId}`
            : `/chat/history`; // user hoặc coach không chọn ai thì lấy của mình

        const res = await api.get(url);
        setMessages(res.data.length ? res.data : [
          { from: "support", text: "Xin chào! Tôi có thể giúp gì cho bạn?" }
        ]);
      } catch {
        setMessages([{ from: "support", text: "Không thể tải tin nhắn." }]);
      }
    };

    fetchHistory();
  }, [targetUserId, role]);


  const handleSend = async (e) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    if (!trimmedInput || !targetUserId) return;

    const newMsg = { from: role, to: targetUserId, text: trimmedInput };
    setMessages(prev => [...prev, newMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await api.post("/chat/send", newMsg);
      if (res.data.reply) {
        setMessages(prev => [...prev, { from: "coach", text: res.data.reply }]);
        toast.success("Đã gửi tin nhắn!");
      }
    } catch {
      setMessages(prev => [...prev, {
        from: "support",
        text: "Không gửi được tin nhắn. Vui lòng thử lại."
      }]);
      toast.error("Lỗi kết nối máy chủ!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.chatContainer}>
      <div style={styles.header}>
        Hộp thư huấn luyện viên
        <span style={{ float: "right", cursor: "pointer" }} onClick={onClose}>✕</span>
      </div>
      <div style={styles.messageList}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              textAlign: msg.from === role ? "right" : "left",
              marginBottom: 8,
            }}
          >
            <span
              style={{
                ...styles.messageBubble,
                background: getMessageColor(msg.from),
              }}
            >
              <b>{getSenderLabel(msg.from)}:</b> {msg.text}
            </span>
          </div>
        ))}
      </div>

      <form onSubmit={handleSend} style={styles.inputForm}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={loading ? "Đang gửi..." : "Nhập tin nhắn..."}
          style={styles.inputField}
          disabled={loading}
        />
        <button
          type="submit"
          style={styles.sendButton}
          disabled={loading}
        >
          Gửi
        </button>
      </form>
    </div>
  );
};

const styles = {
  chatContainer: {
    position: "fixed",
    bottom: 24,
    right: 24,
    width: 340,
    background: "#fff",
    borderRadius: 12,
    boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
    zIndex: 9999,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    fontFamily: "sans-serif",
    height: "400px"
  },
  header: {
    background: "#1976d2",
    color: "#fff",
    padding: "12px 16px",
    fontWeight: 600,
    fontSize: 16,
  },
  messageList: {
    flex: 1,
    padding: 16,
    maxHeight: 320,
    overflowY: "auto",
    background: "#fafafa",
  },
  messageBubble: {
    display: "inline-block",
    color: "#222",
    borderRadius: 8,
    padding: "6px 12px",
    maxWidth: "80%",
    wordBreak: "break-word",
  },
  inputForm: {
    display: "flex",
    borderTop: "1px solid #eee",
  },
  inputField: {
    flex: 1,
    border: "none",
    padding: 12,
    outline: "none",
    fontSize: 14,
  },
  sendButton: {
    background: "#1976d2",
    color: "#fff",
    border: "none",
    padding: "0 16px",
    fontWeight: 600,
    fontSize: 14,
  },
};

export default ChatSupport;
