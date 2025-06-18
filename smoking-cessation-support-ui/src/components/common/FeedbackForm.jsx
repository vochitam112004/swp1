import React, { useState } from "react";
import { Rating, TextField, Button } from "@mui/material";
import api from "../../api/axios";

export default function FeedbackForm({ planId }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/feedback", { planId, rating, comment });
    setComment("");
    setRating(5);
    alert("Cảm ơn bạn đã đánh giá!");
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