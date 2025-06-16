import { Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import api from "../../api/axios.js";
import "../../css/Blog.css"; // Adjust the path as necessary

export default function Blog() {
  const [form, setForm] = useState({
    title: "",
    content: "",
  });
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    api.get("blog")
      .then(res => setPosts(res.data))
      .catch(() => setPosts([]));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("blog", form);
      toast.success("Bài viết đã được gửi thành công!");
      setPosts([response.data, ...posts]);
      setForm({
        title: "",
        content: "",
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Đã xảy ra lỗi khi gửi bài viết!");
    }
  };

  return (
    <>
    <h1 className="blog-title">Blog</h1>
    <div className="blog-container">
      <div className="blog-form">
        <form onSubmit={handleSubmit}>
          <h2>Đăng bài Blog mới</h2>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Tiêu đề bài viết"
            required
          />
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            placeholder="Nội dung bài viết"
            rows={8}
            required
          />
          <button type="submit">Đăng bài</button>
        </form>
      </div>
      <div className="blog-list">
        <h6>Danh sách bài viết</h6>
        {posts.length === 0 && <Typography>Chưa có bài viết nào.</Typography>}
        {posts.map((post, idx) => (
          <div className="blog-post" key={post.id || idx}>
            <div className="blog-post-title">{post.title}</div>
            <div className="blog-post-content">{post.content}</div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
}