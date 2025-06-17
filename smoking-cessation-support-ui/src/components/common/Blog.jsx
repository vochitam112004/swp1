import React from "react";
import { Link } from "react-router-dom";
import BlogPosts from "../common/BlogPosts";
import "../../css/Blog.css";

export default function Blog() {
  return (
    <div className="blog-container">
      <h1 className="blog-title">Danh sách bài viết Blog</h1>
      <div className="blog-list">
        {BlogPosts.length === 0 && (
          <div>Chưa có bài viết nào.</div>
        )}
        {BlogPosts.map((post) => (
          <div className="blog-item" key={post.id}>
            <Link to={`/blog/${post.id}`}>
              <img className="blog-image" src={post.image} alt={post.title} />
            </Link>
            <div className="blog-content">
              <Link to={`/blog/${post.id}`} className="blog-title-link">
                <h2 className="blog-post-title">{post.title}</h2>
              </Link>
              <div className="blog-meta">
                <span className="blog-author">{post.author}</span> - <span className="blog-date">{new Date(post.date).toLocaleDateString("vi-VN")}</span>
              </div>
              <div className="blog-summary">{post.summary}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}