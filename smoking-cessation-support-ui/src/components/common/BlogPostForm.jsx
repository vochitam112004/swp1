import React, { useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function BlogPostForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Lấy token từ localStorage (nếu cần xác thực)
  const token = localStorage.getItem("authToken");
  if (!token) {
    return <div>Bạn cần <Link to="/login">đăng nhập</Link> để đăng bài.</div>;
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    } else {
      setImage(null);
      setPreview(null);
      toast.error("Vui lòng chọn file ảnh hợp lệ!");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error("Vui lòng nhập tiêu đề và nội dung!");
      return;
    }
    setLoading(true);
    try {
      let imageUrl = "";
      if (image) {
        const formData = new FormData();
        formData.append("file", image);
        const res = await api.post("/Upload/image", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        imageUrl = res.data.url;
      }
      await api.post(
        "/CommunityPost",
        {
          title,
          content,
          image: imageUrl,
          createdAt: new Date().toISOString(),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Đăng bài thành công!");
      setTitle("");
      setContent("");
      setImage(null);
      setPreview(null);
      navigate("/blog");
    } catch (err) {
      toast.error("Đăng bài thất bại!");
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
      <div style={{ marginBottom: 12 }}>
        <label>
          Ảnh đại diện bài viết:
          <input type="file" accept="image/*" onChange={handleImageChange} style={{ marginLeft: 8 }} />
        </label>
        {preview && (
          <div style={{ marginTop: 8 }}>
            <img src={preview} alt="preview" style={{ maxWidth: 180, borderRadius: 8 }} />
          </div>
        )}
      </div>
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