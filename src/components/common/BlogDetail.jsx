import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, CircularProgress, Alert } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import api, { baseApiUrl } from "../../api/axios";
import "../../css/Blog.css";

export default function BlogDetail() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await api.get("/CommunityPost");
        const found = res.data.find(p => p.postId === parseInt(postId));
        if (found) {
          found.imageUrl = found.imageUrlPath; // Gán đúng URL
          setPost(found);
        } else {
          setError("Không tìm thấy bài viết.");
        }
      } catch {
        setError("Không thể tải bài viết.");
      } finally {
        setLoading(false);
      }
    };
    if (postId) fetchPost();
  }, [postId]);

  const back = () => navigate("/blog");

  if (loading) return <div className="blog-detail-container"><CircularProgress /><p>Đang tải...</p></div>;
  if (error) return (
    <div className="blog-detail-container">
      <Alert severity="error">{error}</Alert>
      <Button variant="contained" onClick={back} startIcon={<ArrowBackIcon />}>Quay lại</Button>
    </div>
  );

  if (!post) return null;

  const fullImgUrl = post.imageUrl?.startsWith("http") ? post.imageUrl : `${baseApiUrl}${post.imageUrl}`;

  return (
    <div className="blog-detail-container">
      <Button variant="outlined" onClick={back} startIcon={<ArrowBackIcon />} sx={{ mb: 2 }}>
        Quay lại
      </Button>

      <article>
        <h1 className="blog-detail-title">{post.title}</h1>
        <div className="blog-detail-meta">
          <span>{post.displayName || "Ẩn danh"}</span> •{" "}
          <span>{new Date(post.createdAt).toLocaleDateString("vi-VN")}</span>
        </div>

        {post.imageUrl && !imageError && (
          <img
            className="blog-detail-image"
            src={fullImgUrl}
            alt={post.title}
            onError={() => setImageError(true)}
          />
        )}

        {imageError && (
          <div style={{ marginTop: 10, color: "red" }}>
            Không thể tải hình ảnh. <a href={fullImgUrl} target="_blank" rel="noreferrer">Mở trong tab mới</a>
          </div>
        )}

        <div className="blog-detail-content-text">{post.content}</div>
      </article>
    </div>
  );
}
