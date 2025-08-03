// ChatSupport component with clean structure and improved consistency
import { useState, useEffect, useCallback } from "react";
import api from "../../api/axios";
import { toast } from "react-toastify";

const getCurrentUser = () => JSON.parse(localStorage.getItem("user") || "{}");
const getUserRole = () => getCurrentUser()?.userType === "Coach" ? "coach" : "user";

const getMessageColor = (fromId, currentUserId) => (fromId === currentUserId ? "#e3f2fd" : "#fff3cd");
const getSenderLabel = (fromId, currentUserId, senderName) => (fromId === currentUserId ? "Bạn" : senderName);

const ChatSupport = ({ targetUserId, onClose, targetDisplayName, isModal = false }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [coaches, setCoaches] = useState([]);
  const [selectedCoachId, setSelectedCoachId] = useState(targetUserId || "");
  const [recentChats, setRecentChats] = useState([]);
  const currentUser = getCurrentUser();
  const role = getUserRole();

  const fetchData = useCallback(async () => {
    if (role === "user") {
      try {
        const coachRes = await api.get("/ChatMessage/available-contacts");
        setCoaches(coachRes.data);
      } catch (err) {
        console.log("Không thể tải danh sách HLV", err);
      }
    }

    let url = "";
    if (role === "coach" && targetUserId) url = `/ChatMessage/history/${targetUserId}`;
    if (role === "user" && selectedCoachId) url = `/ChatMessage/history/${selectedCoachId}`;
    if (!url) return;

    try {
      const res = await api.get(url);
      const msgs = res.data?.length
        ? res.data.map((msg) => ({ ...msg, from: msg.senderId }))
        : [{ senderId: null, senderDisplayName: "Hệ thống", content: "Xin chào! Tôi có thể giúp gì cho bạn?" }];
      setMessages(msgs);
    } catch (err) {
      console.error("Lỗi tải lịch sử tin nhắn", err);
    }
  }, [role, targetUserId, selectedCoachId]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
    }, 2000);
    return () => clearInterval(interval);
  }, [fetchData]);

  useEffect(() => {
    if (role === "coach") {
      api.get("/ChatMessage/recent-chat")
        .then((res) => setRecentChats(res.data))
        .catch(() => console.error("Không thể lấy danh sách trò chuyện gần đây"));
    }
  }, [role]);

  const handleSend = async (e) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    if (!trimmedInput || (!targetUserId && !selectedCoachId)) return;

    const receiverId = role === "user" ? selectedCoachId : targetUserId;
    const newMsg = { receiverId, content: trimmedInput };

    setMessages((prev) => [
      ...prev,
      {
        senderId: currentUser.id,
        senderDisplayName: currentUser.fullName || "Bạn",
        content: trimmedInput,
      },
    ]);
    setInput("");
    setLoading(true);

    try {
      await api.post("/ChatMessage/send", newMsg);
      await fetchData();
    } catch (error) {
      toast.error("Gửi tin nhắn thất bại: " + (error.response?.data?.message || "Lỗi kết nối!"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={isModal ? styles.chatContainerModal : styles.chatContainer}>
      {!isModal && (
        <div style={styles.header}>
          {targetDisplayName}
          <span style={{ float: "right", cursor: "pointer" }} onClick={onClose}>✕</span>
        </div>
      )}

      {role === "user" && !targetUserId && (
        <div style={styles.dropdownContainer}>
          <label style={styles.label}>Chọn huấn luyện viên:</label>
          <select
            value={selectedCoachId}
            onChange={(e) => setSelectedCoachId(e.target.value)}
            style={styles.select}
          >
            <option value="">-- Chọn --</option>
            {coaches.map((coach) => (
              <option key={coach.userId} value={coach.userId}>{coach.displayName}</option>
            ))}
          </select>
        </div>
      )}

      <div style={isModal ? styles.messageListModal : styles.messageList}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ textAlign: msg.senderId === currentUser.id ? "right" : "left", marginBottom: 8 }}>
            <span
              style={{
                ...styles.messageBubble,
                background: getMessageColor(msg.senderId, currentUser.id),
              }}
            >
              <b>{getSenderLabel(msg.senderId, currentUser.id, msg.senderDisplayName)}:</b> {msg.content}
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
        <button type="submit" style={styles.sendButton} disabled={loading}>
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
    height: "400px",
  },
  chatContainerModal: {
    background: "#fff",
    display: "flex",
    flexDirection: "column",
    height: "500px",
    fontFamily: "sans-serif",
  },
  header: {
    background: "#1976d2",
    color: "#fff",
    padding: "12px 16px",
    fontWeight: 600,
    fontSize: 16,
  },
  dropdownContainer: {
    padding: "16px 24px 8px 24px",
    borderBottom: "1px solid #e3e3e3",
    background: "#f5f7fa",
  },
  label: {
    fontWeight: 600,
    color: "#1976d2",
    marginBottom: 6,
    display: "block",
  },
  select: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #bfc8d6",
    background: "#fff",
    fontSize: 15,
    color: "#222",
    outline: "none",
    boxShadow: "0 1px 2px #0001",
  },
  messageList: {
    flex: 1,
    padding: 16,
    maxHeight: 320,
    overflowY: "auto",
    background: "#fafafa",
  },
  messageListModal: {
    flex: 1,
    padding: 16,
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