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
        setError("");
        const res = await api.get("/CommunityPost");

        if (!Array.isArray(res.data)) {
          throw new Error("Dữ liệu bài viết không hợp lệ.");
        }

        const found = res.data.find(p => p.postId === parseInt(postId));
        if (found) {
          setPost(found);
        } else {
          setError("Không tìm thấy bài viết.");
        }
      } catch (err) {
        setError("Không thể tải bài viết.");
      } finally {
        setLoading(false);
      }
    };

    if (postId) fetchPost();
  }, [postId]);

  const back = () => navigate("/blog");

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "/images/blog1.jpg";
    return imagePath.startsWith("http") ? imagePath : `${baseApiUrl}${imagePath}`;
  };

  if (loading) {
    return (
      <div className="blog-detail-container">
        <CircularProgress />
        <p>Đang tải...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="blog-detail-container">
        <Alert severity="error">{error}</Alert>
        <Button variant="contained" onClick={back} startIcon={<ArrowBackIcon />}>
          Quay lại
        </Button>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="blog-detail-container">
        <Alert severity="warning">Không tìm thấy bài viết phù hợp.</Alert>
        <Button variant="contained" onClick={back} startIcon={<ArrowBackIcon />}>
          Quay lại
        </Button>
      </div>
    );
  }

  return (
    <div className="blog-detail-container">
      <Button variant="outlined" onClick={back} startIcon={<ArrowBackIcon />} sx={{ mb: 2 }}>
        Quay lại
      </Button>

      <article>
        <h1 className="blog-detail-title">{post.title || "(Không có tiêu đề)"}</h1>
        <div className="blog-detail-meta">
          <span>{post.displayName || "Ẩn danh"}</span> •{" "}
          <span>{new Date(post.createdAt).toLocaleDateString("vi-VN")}</span>
        </div>

        {!imageError && (
          <img
            width={"50%"}
            className="blog-detail-image"
            src={getImageUrl(post.imageUrl || post.imageUrlPath)}
            alt={post.title}
            onError={() => setImageError(true)}
          />
        )}

        {imageError && (
          <div style={{ marginTop: 10, color: "red" }}>
            Không thể tải hình ảnh.{" "}
            <a href={getImageUrl(post.imageUrl || post.imageUrlPath)} target="_blank" rel="noreferrer">
              Mở trong tab mới
            </a>
          </div>
        )}

        <div className="blog-detail-content-text">{post.content || "(Không có nội dung)"}</div>
      </article>
    </div>
  );
}
