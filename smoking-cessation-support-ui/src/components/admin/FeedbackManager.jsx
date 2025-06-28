import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, Rating, Button, CircularProgress } from "@mui/material";
import api from "../../api/axios";
import { toast } from "react-toastify";

export default function FeedbackManager() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFeedbacks = () => {
    setLoading(true);
    api.get("/feedback")
      .then(res => setFeedbacks(res.data))
      .catch(() => setFeedbacks([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa đánh giá này?")) return;
    try {
      await api.delete(`/feedback/${id}`);
      toast.success("Đã xóa đánh giá!");
      fetchFeedbacks();
    } catch {
      toast.error("Xóa đánh giá thất bại!");
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", mt: 4 }}>
      <Typography variant="h5" fontWeight={700} mb={3}>Quản lý phản hồi & đánh giá</Typography>
      {feedbacks.length === 0 ? (
        <Typography>Chưa có đánh giá nào.</Typography>
      ) : (
        feedbacks.map((fb, idx) => (
          <Paper key={fb.id || idx} sx={{ p: 2, mb: 2, position: "relative" }}>
            <Box display="flex" alignItems="center" mb={1}>
              <Rating value={fb.rating} readOnly size="small" />
              <Typography ml={2} color="text.secondary" fontSize={14}>
                {fb.userName || "Ẩn danh"} - {fb.planId ? `Gói: ${fb.planId}` : ""}
              </Typography>
            </Box>
            <Typography>{fb.comment}</Typography>
            <Button
              variant="outlined"
              color="error"
              size="small"
              sx={{ position: "absolute", top: 8, right: 8 }}
              onClick={() => handleDelete(fb.id)}
            >
              Xóa
            </Button>
          </Paper>
        ))
      )}
    </Box>
  );
}