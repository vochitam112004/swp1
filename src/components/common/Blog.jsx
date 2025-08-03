import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import { toast } from "react-toastify";
import "../../css/Blog.css";
import { Button } from "@mui/material";
import { baseApiUrl } from "../../api/axios";
import { useAuth } from "../auth/AuthContext";

function removeVietnameseTones(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}

const POSTS_PER_PAGE = 3;

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("all");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();

  const token = localStorage.getItem("authToken");

  const tags = [
    { id: "all", label: "Tất cả", count: 0 },
    { id: "health", label: "Sức khỏe", count: 0 },
    { id: "psychology", label: "Tâm lý", count: 0 },
    { id: "tips", label: "Mẹo vặt", count: 0 },
    { id: "story", label: "Câu chuyện", count: 1 }
  ];

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
    e.preventDefault(); // ✅ Ngăn Link navigation
    e.stopPropagation(); // ✅ Ngăn event bubble up

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
    .filter((post) => {
      const matchesSearch = removeVietnameseTones(post.title?.toLowerCase() || "").includes(
        removeVietnameseTones(search.toLowerCase())
      );
      const matchesTag = selectedTag === "all" || post.category === selectedTag;
      return matchesSearch && matchesTag;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice(
    (page - 1) * POSTS_PER_PAGE,
    page * POSTS_PER_PAGE
  );

  const recentPosts = posts
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 3);

  return (
    <div className="blog-container">
      {/* Header */}
      <div className="blog-header">
        <div className="blog-header-content">
          <h1 className="blog-header-title">Blog hướng dẫn cai thuốc lá</h1>
          <p className="blog-header-subtitle">
            Kiến thức chuyên môn, meo vặt hữu ích và câu chuyện truyền cảm hứng từ các chuyên gia và cộng đồng
          </p>
        </div>
      </div>

      <div className="blog-main">
        <div className="blog-content">
          {/* Search and Tags */}
          <div className="blog-search-section">
            <div className="search-container">
              <input
                type="text"
                placeholder="Tìm kiếm bài viết..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="blog-search-input"
              />
              <i className="fas fa-search search-icon"></i>
            </div>

            <div className="blog-tags">
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  className={`tag-button ${selectedTag === tag.id ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedTag(tag.id);
                    setPage(1);
                  }}
                >
                  {tag.label} {tag.count > 0 && <span className="tag-count">{tag.count}</span>}
                </button>
              ))}
            </div>
          </div>

          {token && (
            <div className="blog__new-post">
              <Link to="/blog/create" className="blog__new-post-link">
                <Button className="blog__new-post-button">+ Đăng bài mới</Button>
              </Link>
            </div>
          )}

          {/* Posts List */}
          <div className="posts-section">
            <h3 className="section-title">Bài viết nổi bật</h3>

            {loading ? (
              <div className="blog__loading">Đang tải bài viết...</div>
            ) : error ? (
              <div className="blog__error">{error}</div>
            ) : filteredPosts.length === 0 ? (
              <div className="blog__empty">
                {search || selectedTag !== "all"
                  ? "Không tìm thấy bài viết phù hợp."
                  : "Chưa có bài viết nào."}
              </div>
            ) : (
              <div className="posts-grid">
                {paginatedPosts.map((post) => {
                  const isOwner = token && user?.userId === post.userId;
                  return (
                    <div key={post.postId} className="post-card">
                      <Link to={`/blog/${post.postId}`} className="post-link">
                        <div className="post-card-content">
                          <div className="post-image">
                            <img
                              src={post.imageUrl ? `${baseApiUrl}${post.imageUrl}` : "/images/blog1.jpg"}
                              alt={post.title}
                            />
                            <div className="post-badge">Bài viết</div>
                          </div>
                          <div className="post-info">
                            <div className="post-meta">
                              <span className="post-date">
                                {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                              </span>
                              <span className="post-category">
                                {post.category === 'health' && 'Sức khỏe'}
                                {post.category === 'psychology' && 'Tâm lý'}
                                {post.category === 'tips' && 'Mẹo vặt'}
                                {post.category === 'story' && 'Câu chuyện'}
                                {!post.category && 'Bài viết'}
                              </span>
                            </div>
                            <h3 className="post-title">
                              {post.title || "(Không có tiêu đề)"}
                            </h3>
                            <p className="post-excerpt">
                              {post.content?.slice(0, 120) || "(Không có nội dung)"}...
                            </p>
                            <div className="post-author">
                              Tác giả: {post.displayName || "Ẩn danh"}
                            </div>
                          </div>
                        </div>
                      </Link>

                      {isOwner && (
                        <>
                          <button
                            className="blog__delete-button"
                            onClick={(e) => handleDelete(e, post.postId)}
                            type="button"
                          >
                            Xóa bài viết
                          </button>
                          <Link
                            to={`/blog/edit/${post.postId}`}
                            className="blog__edit-button"
                          >
                            Sửa bài
                          </Link>
                        </>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {totalPages > 1 && (
              <div className="blog__pagination">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setPage(i + 1)}
                    className={`blog__pagination-button ${page === i + 1 ? "blog__pagination-button--active" : ""
                      }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="blog-sidebar">
          <div className="sidebar-section">
            <h3 className="sidebar-title">Bài viết mới nhất</h3>
            <div className="recent-posts">
              {recentPosts.map((post) => (
                <Link key={post.postId} to={`/blog/${post.postId}`} className="recent-post-item">
                  <div className="recent-post-image">
                    <img
                      src={post.imageUrl ? `${baseApiUrl}${post.imageUrl}` : "/images/blog1.jpg"}
                      alt={post.title}
                    />
                  </div>
                  <div className="recent-post-content">
                    <h4 className="recent-post-title">
                      {post.title?.slice(0, 50) || "(Không có tiêu đề)"}
                      {post.title?.length > 50 && "..."}
                    </h4>
                    <span className="recent-post-date">
                      {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

