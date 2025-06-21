import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import BlogPosts from "./BlogPosts";
import api from "../../api/axios";
import { toast } from "react-toastify";
import "../../css/Blog.css";

export default function BlogDetail() {
  // ...lấy post, token, v.v...
  const { id } = useParams();
  const navigate = useNavigate();
  const post = BlogPosts.find((p) => String(p.id) === String(id));

  // Đổi tên biến token cho đúng với localStorage key bạn dùng để xác thực
  const token = localStorage.getItem("authToken");

  // Hàm xóa bài viết
  const handleDelete = async () => {
    if (window.confirm("Bạn có chắc muốn xóa bài này không?")) {
      try {
        await api.delete(`/CommunityPost/${post.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Đã xóa bài đăng!");
        navigate("/blog");
      } catch (err) {
        toast.error("Xóa bài thất bại!");
      }
    }
  };

  if (!post)
    return (
      <div style={{ padding: 32 }}>
        <h2>Chi tiết bài viết</h2>
        <p>Bài viết không tồn tại.</p>
        <Link to="/blog">← Quay lại danh sách</Link>
      </div>
    );

  return (
    <div className="blog-detail-container">
      <div
        className="alert alert-info"
        style={{ marginBottom: 20, borderRadius: 12, fontWeight: 500 }}
      >
        🚀 <b>Bạn đã sẵn sàng thay đổi cuộc đời?</b> Hãy đọc câu chuyện này và tìm cảm hứng cho hành trình của chính bạn!
      </div>
      <Link to="/blog" className="blog-back-link">
        ← Quay lại danh sách
      </Link>
      <h1 className="blog-post-title">{post.title}</h1>
      <div className="blog-meta">
        {post.author} - {post.date}
      </div>
      {/* Hiển thị ảnh nếu có */}
      {post.image && (
        <img className="blog-image" src={post.image} alt={post.title} />
      )}
      <div className="blog-summary">{post.summary}</div>
      <div className="blog-content-detail">{post.content}</div>
      {/* Nút xóa bài đăng, chỉ hiển thị nếu có token (đã đăng nhập) */}
      {token && (
        <button
          onClick={handleDelete}
          style={{
            background: "#e53935",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            padding: "8px 20px",
            fontWeight: 600,
            marginTop: 16,
            cursor: "pointer",
          }}
        >
          Xóa bài đăng
        </button>
      )}
    </div>
  );
}