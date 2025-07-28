import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import { toast } from "react-toastify";
import "../../css/Blog.css";
import { Button } from "@mui/material";

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

  const fetchPosts = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/CommunityPost");
      if (!Array.isArray(res.data)) {
        throw new Error("Dữ liệu bài viết không hợp lệ");
      }
      setPosts(res.data);
    } catch (err) {
      setError(err.message || "Không thể tải bài viết.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (e, postId) => {
    e.stopPropagation(); // Ngăn mở modal khi bấm xóa

    if (!window.confirm("Bạn chắc chắn muốn xóa bài viết này?")) return;

    try {
      await api.delete(`/CommunityPost/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Đã xóa bài viết");
      fetchPosts();
    } catch (err) {
      console.error("Lỗi xóa bài viết:", err);
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
    <div className="blog">
      <h1 className="blog__title">Danh sách bài viết Blog</h1>

      {token && (
        <div className="blog__new-post">
          <Link to="/blog/create" className="blog__new-post-link">
            <Button className="blog__new-post-button">+ Đăng bài mới</Button>
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
        className="blog__search"
      />

      {loading ? (
        <div className="blog__loading">Đang tải bài viết...</div>
      ) : error ? (
        <div className="blog__error">{error}</div>
      ) : filteredPosts.length === 0 ? (
        <div className="blog__empty">
          {search
            ? "Không tìm thấy bài viết phù hợp."
            : "Chưa có bài viết nào."}
        </div>
      ) : (
        <div className="blog__list">
          {paginatedPosts.map((post) => (
            <Link 
              to={`/blog/${post.postId}`}
              key={post.postId}
              className="blog__item-link"
            >
              <div className="blog__item">
                <div className="blog__content">
                  <h2 className="blog__post-title blog__post-title--clickable">
                    {post.title || "(Không có tiêu đề)"}
                  </h2>
                  <div className="blog__meta">
                    <span className="blog__author">
                      {post.displayName || "Ẩn danh"}
                    </span>{" "}
                    -{" "}
                    <span className="blog__date">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="blog__summary">
                    {post.content?.slice(0, 150) || "(Không có nội dung)"}...
                  </p>

                  {token && (
                    <button
                      className="blog__delete-button"
                      onClick={(e) => handleDelete(e, post.postId)}
                    >
                      Xóa
                    </button>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="blog__pagination">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setPage(i + 1)}
              className={`blog__pagination-button ${
                page === i + 1 ? "blog__pagination-button--active" : ""
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
