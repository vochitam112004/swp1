import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api, { baseApiUrl } from "../../api/axios";
import { toast } from "react-toastify";
import "../../css/Blog.css";
import { useAuth } from "../auth/AuthContext";

export default function BlogEditForm() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { user, authToken } = useAuth();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await api.get(`/CommunityPost`);
        const posts = res.data;
        const post = posts.find(p => p.postId.toString() === postId);

        if (!post || user?.userId !== post.userId) {
          toast.error("Bạn không có quyền chỉnh sửa bài viết này.");
          return navigate("/blog");
        }

        setTitle(post.title);
        setContent(post.content);
        setExistingImageUrl(post.imageUrl);
      } catch (err) {
        toast.error("Không thể tải bài viết.");
        navigate("/blog");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId, user, navigate]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error("Vui lòng nhập đầy đủ tiêu đề và nội dung.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);

    if (image instanceof File) {
      formData.append("imageUrl", image);
    }

    try {
      await api.post(`/CommunityPost/Update/${postId}`, formData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Cập nhật bài viết thành công!");
      navigate(`/blog/${postId}`);
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi cập nhật bài viết.");
    }
  };

  if (loading) return <div>Đang tải bài viết...</div>;

  return (
    <form onSubmit={handleSubmit} className="blog-form">
      <h2 className="blog-form__title">Chỉnh sửa bài viết</h2>

      <input
        type="text"
        className="blog-form__input"
        placeholder="Tiêu đề"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <textarea
        className="blog-form__textarea"
        placeholder="Nội dung"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={8}
        required
      />

      <div className="blog-form__image-preview">
        <label>Ảnh hiện tại:</label>
        {existingImageUrl ? (
          <img src={`${baseApiUrl}${existingImageUrl}`} alt="Preview" width={200} />
        ) : (
          <p>(Không có ảnh)</p>
        )}
      </div>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
      />

      <button type="submit" className="blog-form__submit">
        Lưu thay đổi
      </button>
    </form>
  );
}
