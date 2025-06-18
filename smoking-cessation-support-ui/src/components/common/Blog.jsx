import React, { useState } from "react";
import { Link } from "react-router-dom";
import BlogPosts from "../common/BlogPosts";
import "../../css/Blog.css";

// Hàm loại bỏ dấu tiếng Việt
function removeVietnameseTones(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}
export default function Blog() {
  const [search, setSearch] = useState("");

  // Lọc bài viết chỉ theo title, không phân biệt dấu
  const filteredPosts = BlogPosts.filter((post) =>
    removeVietnameseTones(post.title.toLowerCase()).includes(
      removeVietnameseTones(search.toLowerCase())
    )
  );


  return (
    <div className="blog-container">
      <h1 className="blog-title">Danh sách bài viết Blog</h1>
      <input
        type="text"
        placeholder="Tìm kiếm bài viết"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: "8px",
          marginBottom: "20px",
          borderRadius: "6px",
          border: "1px solid #ccc",
          fontSize: "16px",
        }}
      />
      <div className="blog-list">
        {BlogPosts.length === 0 ? (
          <div>Chưa có bài viết nào.</div>
        ) : filteredPosts.length === 0 ? (
          <div>Không tìm thấy bài viết phù hợp.</div>
        ) : (
          filteredPosts.map((post) => (
            <div className="blog-item" key={post.id}>
              <Link to={`/blog/${post.id}`}>
                <img className="blog-image" src={post.image} alt={post.title} />
              </Link>
              <div className="blog-content">
                <Link to={`/blog/${post.id}`} className="blog-title-link">
                  <h2 className="blog-post-title">{post.title}</h2>
                </Link>
                <div className="blog-meta">
                  <span className="blog-author">{post.author}</span> - <span className="blog-date">{post.date}</span>
                </div>
                <div className="blog-summary">{post.summary}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}