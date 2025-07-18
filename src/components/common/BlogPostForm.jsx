import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios"; // Giả sử axios.js đã được cấu hình interceptor

export default function BlogPostForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  // Cải thiện luồng chuyển hướng nếu chưa đăng nhập
  useEffect(() => {
    if (!token) {
      toast.warn("Bạn cần đăng nhập để đăng bài.");
      navigate("/login");
    }
  }, [token, navigate]);

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
        // BỎ header thủ công, interceptor sẽ tự làm
        const res = await api.post("/Upload/image", formData);
        imageUrl = res.data.url; // Giả sử API trả về { url: '...' }
      }

      await api.post("/CommunityPost", {
        title,
        content,
        image: imageUrl,
      });

      toast.success("Đăng bài thành công!");
      navigate("/blog"); // Chuyển hướng sau khi thành công
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Đăng bài thất bại!";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Nếu chưa có token, không hiển thị form để tránh flicker
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
        onChange={e => setTitle(e.target.value)}
        required
      />

      <textarea
        className="blog-form__textarea"
        placeholder="Nội dung"
        value={content}
        onChange={e => setContent(e.target.value)}
        required
        rows={8}
      />

      <div>
        <label className="blog-form__label">
          Ảnh đại diện bài viết:
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="blog-form__file-input"
          />
        </label>

        {preview && (
          <div>
            <img src={preview} alt="preview" className="blog-form__preview" />
          </div>
        )}
      </div>

      <button type="submit" disabled={loading} className="blog-form__submit">
        {loading ? "Đang đăng..." : "Đăng bài"}
      </button>
    </form>

  );
}