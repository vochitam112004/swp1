import React, { useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function BlogPostForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Lấy token từ localStorage (nếu cần xác thực)
  const token = localStorage.getItem("authToken");
  if (!token) {
    return <div>Bạn cần <Link to="/login">đăng nhập</Link> để đăng bài.</div>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error("Vui lòng nhập tiêu đề và nội dung!");
      return;
    }
    setLoading(true);
    try {
      await api.post(
        "/CommunityPost",
        {
          title,
          content,
          createdAt: new Date().toISOString(),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Đăng bài thành công!");
      setTitle("");
      setContent("");
      navigate("/blog");
    } catch (err) {
      // Hiển thị chi tiết lỗi nếu có phản hồi từ server, nếu không thì hiển thị thông báo chung
      if (err.response && err.response.data && err.response.data.message) {
        toast.error(`Đăng bài thất bại: ${err.response.data.message}`);
      } else {
        toast.error("Đăng bài thất bại!");
      }
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 600, margin: "0 auto" }}>
      <h2>Đăng bài mới</h2>
      <input
        type="text"
        placeholder="Tiêu đề"
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
        style={{ width: "100%", marginBottom: 12, padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
      />
      <textarea
        placeholder="Nội dung"
        value={content}
        onChange={e => setContent(e.target.value)}
        required
        rows={8}
        style={{ width: "100%", marginBottom: 12, padding: 8, borderRadius: 4, border: "1px solid #ccc" }}
      />
      <button
        type="submit"
        disabled={loading}
        style={{
          background: "#1976d2",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          padding: "8px 20px",
          fontWeight: 600,
          cursor: loading ? "not-allowed" : "pointer"
        }}
      >
        {loading ? "Đang đăng..." : "Đăng bài"}
      </button>
    </form>
  );
}