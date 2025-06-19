import React, { useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function BlogPostForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  // Lấy token từ localStorage
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
    try {
      await api.post(
        "/blog/create",
        { title, content },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Đăng bài thành công!");
      setTitle("");
      setContent("");
      navigate("/blog");
    } catch (err) {
      toast.error("Đăng bài thất bại!");
    }
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
      <button type="submit" style={{
        background: "#1976d2",
        color: "#fff",
        border: "none",
        borderRadius: 6,
        padding: "8px 20px",
        fontWeight: 600,
        cursor: "pointer"
      }}>
        Đăng bài
      </button>
    </form>
  );
}