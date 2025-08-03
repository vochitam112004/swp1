import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import api from "../../api/axios";
import "../../css/Blog.css";

export default function BlogPostForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (!token) {
      toast.warn("Bạn cần đăng nhập để đăng bài.");
      navigate("/login");
    }
  }, [token, navigate]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
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
      const formData = new FormData();
      formData.append("Title", title);
      formData.append("Content", content);
      formData.append("CreatedAt", new Date().toISOString());

      if (imageFile) {
        formData.append("ImageUrl", imageFile); // ImageUrl là field nhận file
      }

      await api.post("/CommunityPost", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Đăng bài thành công!");
      navigate("/blog");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Đăng bài thất bại!");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return <div>Bạn cần <Link to="/login">đăng nhập</Link> để đăng bài.</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="blog-form">
      <h2 className="blog-form__title">Đăng bài mới</h2>

      <input
        type="text"
        className="blog-form__input"
        placeholder="Tiêu đề"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <textarea
        className="blog-form__textarea"
        placeholder="Nội dung"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        rows={8}
      />

      <input
        type="file"
        accept="image/*"
        className="blog-form__input"
        onChange={handleImageChange}
      />

      <button type="submit" disabled={loading} className="blog-form__submit">
        {loading ? "Đang đăng..." : "Đăng bài"}
      </button>
    </form>
  );
}
