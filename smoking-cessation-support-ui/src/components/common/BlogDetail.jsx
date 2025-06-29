// components/BlogDetailModal.jsx
import React from "react";
import "../../css/Blog.css";

export default function BlogDetailModal({ post, onClose }) {
  if (!post) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>×</button>

        <h1 className="blog-post-title">{post.title}</h1>
        <div className="blog-meta">
          {post.displayName} - {new Date(post.createdAt).toLocaleDateString()}
        </div>
        {post.image && (
          <img className="blog-image" src={post.image} alt={post.title} />
        )}
        <div className="blog-content-detail">{post.content}</div>
      </div>
    </div>
  );
}
