import React from "react";
import { useParams, Link } from "react-router-dom";
import BlogPosts from "../common/BlogPosts";
import "../../css/Blog.css";

export default function BlogDetail() {
  const { id } = useParams();
  const post = BlogPosts.find((p) => String(p.id) === String(id));

  if (!post) return <div>Bài viết không tồn tại.</div>;

  return (
    <div className="blog-detail-container">
      <div
        className="alert alert-info"
        style={{ marginBottom: 20, borderRadius: 12, fontWeight: 500 }}
      >
        Bạn đang xem chi tiết bài viết. Nhấn "<b>← Quay lại danh sách</b>" để
        trở về trang blog.
      </div>
      <Link to="/blog" className="blog-back-link">
        ← Quay lại danh sách
      </Link>
      <h1 className="blog-post-title">{post.title}</h1>
      <div className="blog-meta">
        {post.author} - {post.date}
      </div>
      <img className="blog-image" src={post.image} alt={post.title} />
      <div className="blog-summary">{post.summary}</div>
      <div className="blog-content-detail">{post.content}</div>
    </div>
  );
}