import React, { useState } from "react";
import {
  Box,
  Rating,
  TextField,
  Button,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import api from "../../api/axios";
import { toast } from "react-toastify";
import "../../css/Feedback.css";

export default function FeedbackForm({ onSubmitted }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [type, setType] = useState("general");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error("Vui lòng nhập nhận xét!");
      return;
    }
    setLoading(true);
    try {
      await api.post("/Feedback/SubmitFeedback", {
        type,
        content: comment,
        rating,
      });
      setComment("");
      setRating(5);
      toast.success("Cảm ơn bạn đã đánh giá!");
      if (onSubmitted) onSubmitted();
    } catch {
      toast.error("Gửi đánh giá thất bại. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      className="feedback-form-container"
    >
      <Typography variant="h6" className="feedback-form-title">
        Đánh giá & Nhận xét
      </Typography>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="feedback-type-label">Loại đánh giá</InputLabel>
        <Select
          labelId="feedback-type-label"
          value={type}
          label="Loại đánh giá"
          onChange={(e) => setType(e.target.value)}
        >
          <MenuItem value="general">Đánh giá sử dụng</MenuItem>
          <MenuItem value="coach">Đánh giá coach</MenuItem>
        </Select>
      </FormControl>
      <Box className="feedback-form-rating">
        <Typography mr={2}>Đánh giá:</Typography>
        <Rating value={rating} onChange={(_, v) => setRating(v)} />
      </Box>
      <TextField
        label="Nhận xét"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        fullWidth
        multiline
        minRows={3}
        className="feedback-form-textfield"
        sx={{ mb: 2 }}
      />
      <Button
        type="submit"
        variant="contained"
        disabled={loading}
        className="feedback-form-button"
      >
        {loading ? "Đang gửi..." : "Gửi đánh giá"}
      </Button>
    </Box>
  );
}
