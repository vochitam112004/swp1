import React from 'react';

function BlogPost({ post }) {
  return (
    <div className="blog-post">
      <h1>{post.title}</h1>
      <p><strong>Author:</strong> {post.author}</p>
      <p><strong>Date:</strong> {new Date(post.date).toLocaleDateString()}</p>
      <img src={post.image} alt={post.title} />
      <div className="blog-content">
        {post.content}
      </div>
    </div>
  );
}

export default BlogPost;