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

const POSTS_PER_PAGE = 5; // Số bài viết mỗi trang

export default function Blog() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Lấy token để kiểm tra đăng nhập
  const token = localStorage.getItem("authToken");

  // Lọc bài viết chỉ theo title, không phân biệt dấu
  const filteredPosts = BlogPosts.filter((post) =>
    removeVietnameseTones(post.title.toLowerCase()).includes(
      removeVietnameseTones(search.toLowerCase())
    )
  );

  // Tính tổng số trang
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);

  // Lấy bài viết cho trang hiện tại
  const paginatedPosts = filteredPosts.slice(
    (page - 1) * POSTS_PER_PAGE,
    page * POSTS_PER_PAGE
  );

  // Chuyển trang
  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo(0, 0); // Cuộn lên đầu trang khi chuyển trang
  };

  return (
    <div className="blog-container">
      <h1 className="blog-title">Danh sách bài viết Blog</h1>
      {/* Nút đăng bài chỉ hiện khi đã đăng nhập */}
      {token && (
        <div style={{ marginBottom: 16 }}>
          <Link to="/blog/create">
            <button
              style={{
                background: "#1976d2",
                color: "#fff",
                border: "none",
                borderRadius: 6,
                padding: "8px 20px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              + Đăng bài mới
            </button>
          </Link>
        </div>
      )}
      <input
        type="text"
        placeholder="Tìm kiếm bài viết"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1); // Reset về trang 1 khi tìm kiếm
        }}
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
        ) : paginatedPosts.length === 0 ? (
          <div>Không tìm thấy bài viết phù hợp.</div>
        ) : (
          paginatedPosts.map((post) => (
            <div className="blog-item" key={post.id}>
              <Link to={`/blog/${post.id}`}>
                <img className="blog-image" src={post.image} alt={post.title} />
              </Link>
              <div className="blog-content">
                <Link to={`/blog/${post.id}`} className="blog-title-link">
                  <h2 className="blog-post-title">{post.title}</h2>
                </Link>
                <div className="blog-meta">
                  <span className="blog-author">{post.author}</span> -{" "}
                  <span className="blog-date">{post.date}</span>
                </div>
                <div className="blog-summary">{post.summary}</div>
              </div>
            </div>
          ))
        )}
      </div>
      {/* Phân trang */}
      {totalPages > 1 && (
        <div
          className="blog-pagination"
          style={{ marginTop: 24, textAlign: "center" }}
        >
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => handlePageChange(i + 1)}
              className={page === i + 1 ? "active" : ""}
              style={{
                margin: "0 4px",
                padding: "6px 12px",
                borderRadius: "4px",
                border: "1px solid #1976d2",
                background: page === i + 1 ? "#1976d2" : "#fff",
                color: page === i + 1 ? "#fff" : "#1976d2",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}