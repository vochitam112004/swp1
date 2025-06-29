import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import BlogDetailModal from "./BlogDetail";
import { toast } from "react-toastify";
import "../../css/Blog.css";

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
  const [detail, setDetail] = useState(null);
  const token = localStorage.getItem("authToken");

  const fetchPosts = async () => {
    try {
      const res = await api.get("/CommunityPost");
      const data = res.data;
      if (!Array.isArray(data)) throw new Error("Dữ liệu không hợp lệ");
      setPosts(data);
    } catch (err) {
      setError(err.message || "Không thể tải bài viết.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (postId) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa bài viết này?")) return;
    try {
      await api.delete(`/CommunityPost/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Đã xóa bài viết");
      fetchPosts();
      setDetail(null); // đóng modal nếu đang mở bài bị xóa
    } catch (err) {
      console.log(err)
      toast.error("Xóa thất bại");
    }
  };

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
        <div>
          {search ? "Không tìm thấy bài viết phù hợp." : "Chưa có bài viết nào."}
        </div>
      ) : (
        <div className="blog-list">
          {paginatedPosts.map((post, index) => (
            <div className="blog-item" key={index} onClick={() => setDetail(post)}>
              <div className="blog-content">
                <h2
                  className="blog-post-title clickable"
                >
                  {post.title || "(Không có tiêu đề)"}
                </h2>
                <div className="blog-meta">
                  <span className="blog-author">{post.displayName || "Ẩn danh"}</span>{" "}
                  -{" "}
                  <span className="blog-date">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="blog-summary">
                  {post.content?.slice(0, 150) || "(Không có nội dung)"}...
                </p>
                {token && (
                  <button
                    className="blog-delete-button"
                    onClick={() => handleDelete(post.postId)}
                  >
                    Xóa
                  </button>
                )}
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
              onClick={() => setPage(i + 1)}
              className={page === i + 1 ? "active" : ""}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {detail && (
        <BlogDetailModal
          post={detail}
          onClose={() => setDetail(null)}
        />
      )}
    </div>
  );
}
