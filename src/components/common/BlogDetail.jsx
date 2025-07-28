import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, CircularProgress, Alert } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import api from "../../api/axios";
import "../../css/Blog.css";

export default function BlogDetail() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        // ✅ Sửa: Lấy tất cả posts rồi filter theo postId
        const response = await api.get(`/CommunityPost`);
        const allPosts = response.data;
        
        // Tìm post theo postId
        const foundPost = allPosts.find(p => p.postId === parseInt(postId));
        
        if (foundPost) {
          setPost(foundPost);
        } else {
          setError("Không tìm thấy bài viết này.");
        }
      } catch (err) {
        console.error("Error fetching post:", err);
        setError("Không thể tải bài viết này.");
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId]);

  const handleBack = () => {
    navigate("/blog");
  };

  if (loading) {
    return (
      <div className="blog-detail-container">
        <div className="blog-detail-loading">
          <CircularProgress />
          <p>Đang tải bài viết...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="blog-detail-container">
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
        >
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="blog-detail-container">
        <Alert severity="warning" sx={{ mb: 2 }}>
          Không tìm thấy bài viết này.
        </Alert>
        <Button
          variant="contained"
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
        >
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  return (
    <div className="blog-detail-container">
      <div className="blog-detail-header">
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mb: 3 }}
        >
          Quay lại danh sách
        </Button>
      </div>

      <article className="blog-detail-content">
        <header className="blog-detail-header-content">
          <h1 className="blog-detail-title">{post.title}</h1>
          <div className="blog-detail-meta">
            <span className="blog-detail-author">
              {post.displayName || "Ẩn danh"}
            </span>
            <span className="blog-detail-separator">•</span>
            <span className="blog-detail-date">
              {new Date(post.createdAt).toLocaleDateString("vi-VN")}
            </span>
          </div>
        </header>

        {post.imageUrl && (
          <div className="blog-detail-image-container">
            <img
              className="blog-detail-image"
              src={post.imageUrl}
              alt={post.title}
            />
          </div>
        )}

        <div className="blog-detail-body">
          <div className="blog-detail-content-text">
            {post.content}
          </div>
        </div>
      </article>
    </div>
  );
}
