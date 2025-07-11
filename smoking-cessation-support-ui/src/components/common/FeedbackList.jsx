import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, CircularProgress } from "@mui/material";
import api from "../../api/axios";
import { Pagination } from "@mui/material";

export default function FeedbackList({ refreshTrigger }) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const rowsPerPage = 4;

  const paginatedFeedbacks = feedbacks.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );


  useEffect(() => {
    setLoading(true);
    api
      .get("/Feedback/PublicSystemFeedbacks")
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : [];
        const generalOnly = list.filter((fb) => fb.isType === false);
        setFeedbacks(generalOnly);
      })
      .catch((err) => {
        console.error("Lỗi lấy feedback:", err);
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
        paginatedFeedbacks.map((fb, idx) => (
          <Paper key={idx} sx={{ p: 2, mb: 2 }}>
            <Typography fontWeight={600}>Đánh giá trải nghiệm hệ thống</Typography>
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
      <Box display="flex" justifyContent="center" mt={2}>
        <Pagination
          count={Math.ceil(feedbacks.length / rowsPerPage)}
          page={page}
          onChange={(_, value) => setPage(value)}
          color="primary"
        />
      </Box>
    </Box>
  );
}
