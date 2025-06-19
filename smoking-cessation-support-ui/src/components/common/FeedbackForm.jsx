import React, { useState } from "react";
import { Rating, TextField, Button } from "@mui/material";
import api from "../../api/axios";
import { toast } from "react-toastify"; 

export default function FeedbackForm({ planId }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error("Vui lòng nhập nhận xét!"); 
      return;
    }
    try {
      await api.post("/feedback", { planId, rating, comment });
      setComment("");
      setRating(5);
      toast.success("Cảm ơn bạn đã đánh giá!"); 
    } catch {
      toast.error("Gửi đánh giá thất bại. Vui lòng thử lại!");
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <Rating value={rating} onChange={(_, v) => setRating(v)} />
      <TextField
        label="Nhận xét"
        value={comment}
        onChange={e => setComment(e.target.value)}
        fullWidth
        multiline
        sx={{ my: 2 }}
      />
      <Button type="submit" variant="contained">Gửi đánh giá</Button>
    </form>
  );
}