import React from 'react';

const BlogList = () => {
  const blogPosts = [
    {
      id: 1,
      title: '5 Tips to Quit Smoking',
      excerpt: 'Discover effective strategies to help you quit smoking for good.',
      date: '2023-10-01',
    },
    {
      id: 2,
      title: 'Understanding Nicotine Addiction',
      excerpt: 'Learn about the science behind nicotine addiction and how to overcome it.',
      date: '2023-09-25',
    },
    {
      id: 3,
      title: 'Success Stories: Overcoming Smoking',
      excerpt: 'Read inspiring stories from individuals who successfully quit smoking.',
      date: '2023-09-15',
    },
  ];

  return (
    <div className="blog-list">
      <h1>Blog Posts</h1>
      <ul>
        {blogPosts.map(post => (
          <li key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.excerpt}</p>
            <p><em>{post.date}</em></p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BlogList;