import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";
import api from "../../api/axios";

export default function FeedbackList({ refreshTrigger }) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get("/Feedback/GetFeedbacks")
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : [];
        const generalOnly = list.filter((fb) => fb.type === "general");
        setFeedbacks(generalOnly);
      })
      .catch((err) => {
        if (err.response?.status === 403) {
          console.error("Bạn không có quyền xem feedback!");
        } else {
          console.error("Lỗi lấy feedback:", err);
        }
        setFeedbacks([]);
      })
      .finally(() => setLoading(false));
  }, [refreshTrigger]);

  if (loading)
    return (
      <Box sx={{ textAlign: "center", mt: 3 }}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", mt: 4 }}>
      <Typography variant="h5" fontWeight={700} mb={2}>
        Đánh giá từ người dùng
      </Typography>

      {feedbacks.length === 0 ? (
        <Typography>Chưa có đánh giá nào.</Typography>
      ) : (
        feedbacks.map((fb, idx) => (
          <Paper key={idx} sx={{ p: 2, mb: 2 }}>
            <Typography fontWeight={600}>Đánh giá sử dụng</Typography>
            <Typography>
              <strong>{fb.disPlayName || "Ẩn danh"}</strong> - {fb.rating}⭐
            </Typography>
            <Typography>{fb.content || "Không có nhận xét"}</Typography>
            <Typography fontSize={12} color="text.secondary">
              {fb.submittedAt && new Date(fb.submittedAt).toLocaleString()}
            </Typography>
          </Paper>
        ))
      )}
    </Box>
  );
}