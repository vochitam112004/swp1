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
  const [error, setError] = useState("");
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await api.get("/CommunityPost");
        console.log("🔍 Content-Type:", res.headers['content-type']);
        const data = res.data;
        console.log("📦 Response data:", data);
        if (!Array.isArray(data)) {
          throw new Error("Phản hồi không phải là mảng bài viết.");
        }

        setPosts(data);
      } catch (err) {
        setError(err.message || "Không thể tải bài viết.");
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Lọc và phân trang
  const filteredPosts = posts
    .filter((post) =>
      removeVietnameseTones(post.title?.toLowerCase() || "").includes(
        removeVietnameseTones(search.toLowerCase())
      )
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

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
            <button className="blog-button">+ Đăng bài mới</button>
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
        className="blog-search"
      />

      {loading ? (
        <div>Đang tải bài viết...</div>
      ) : error ? (
        <div style={{ color: "red" }}>❌ {error}</div>
      ) : filteredPosts.length === 0 ? (
        <div>{search ? "Không tìm thấy bài viết phù hợp." : "Chưa có bài viết nào."}</div>
      ) : (
        <div className="blog-list">
          {paginatedPosts.map((post, index) => (
            <div className="blog-item" key={index}>
              <div className="blog-content">
                <h2 className="blog-post-title">{post.title || "(Không có tiêu đề)"}</h2>
                <div className="blog-meta">
                  <span className="blog-author">{post.displayName || "Ẩn danh"}</span> -{" "}
                  <span className="blog-date">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="blog-summary">
                  {post.content?.slice(0, 150) || "(Không có nội dung)"}...
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="blog-pagination">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => handlePageChange(i + 1)}
              className={page === i + 1 ? "active" : ""}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
