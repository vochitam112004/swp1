import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, Rating, CircularProgress } from "@mui/material";
import api from "../../api/axios";

export default function FeedbackList({ coachId }) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let url = "/feedback";
    if (coachId) url += `?coachId=${coachId}`;
    api.get(url)
      .then(res => setFeedbacks(res.data))
      .catch(() => setFeedbacks([]))
      .finally(() => setLoading(false));
  }, [coachId]);

  if (loading) return <CircularProgress />;

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
      <Typography variant="h5" fontWeight={700} mb={3}>Đánh giá cho huấn luyện viên</Typography>
      {feedbacks.length === 0 ? (
        <Typography>Chưa có đánh giá nào.</Typography>
      ) : (
        feedbacks.map((fb, idx) => (
          <Paper key={idx} sx={{ p: 2, mb: 2 }}>
            <Box display="flex" alignItems="center" mb={1}>
              <Rating value={fb.rating} readOnly size="small" />
              <Typography ml={2} color="text.secondary" fontSize={14}>
                {fb.userName || "Ẩn danh"}
              </Typography>
            </Box>
            <Typography>{fb.comment}</Typography>
          </Paper>
        ))
      )}
    </Box>
  );
}