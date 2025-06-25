import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import "../../css/Blog.css";

// Hàm loại bỏ dấu tiếng Việt
function removeVietnameseTones(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}

const POSTS_PER_PAGE = 5;

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await api.get("/CommunityPost");
        setPosts(res.data);
      } catch (error) {
        console.error("Lỗi khi tải bài viết:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Lọc bài viết hợp lệ và theo từ khóa tìm kiếm
  const filteredPosts = posts
    .filter((post) => post.Title && removeVietnameseTones(post.Title.toLowerCase()).includes(removeVietnameseTones(search.toLowerCase())))
    .sort((a, b) => new Date(b.CreatedAt) - new Date(a.CreatedAt)); // Sắp xếp mới nhất trước

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice(
    (page - 1) * POSTS_PER_PAGE,
    page * POSTS_PER_PAGE
  );

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo(0, 0);
  };

  return (
    <div className="blog-container">
      <h1 className="blog-title">Danh sách bài viết Blog</h1>

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
          setPage(1);
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

      {loading ? (
        <div>Đang tải bài viết...</div>
      ) : (
        <div className="blog-list">
          {posts.length === 0 ? (
            <div>Chưa có bài viết nào.</div>
          ) : paginatedPosts.length === 0 ? (
            <div>Không tìm thấy bài viết phù hợp.</div>
          ) : (
            paginatedPosts.map((post, index) => (
              <div className="blog-item" key={index}>
                <div className="blog-content">
                  <h2 className="blog-post-title">{post.Title || "(Không có tiêu đề)"}</h2>
                  <div className="blog-meta">
                    <span className="blog-author">{post.DisplayName || "Ẩn danh"}</span>{" "}
                    - <span className="blog-date">{new Date(post.CreatedAt).toLocaleDateString()}</span>
                  </div>
                  <p className="blog-summary">{post.Content.slice(0, 150)}...</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {totalPages > 1 && (
        <div className="blog-pagination" style={{ marginTop: 24, textAlign: "center" }}>
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
