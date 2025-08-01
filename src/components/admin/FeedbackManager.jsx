import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Rating,
  IconButton,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Pagination,
  Stack,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import api from "../../api/axios";
import { toast } from "react-toastify";

export default function FeedbackManager() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const [filterRating, setFilterRating] = useState("");
  const [filterKeyword, setFilterKeyword] = useState("");
  const [filterType, setFilterType] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchFeedbacks = async () => {
    setLoading(true);
    let generalList = [];
    let coachList = [];

    try {
      const generalRes = await api.get("/Feedback/GetAllFeedbacksMemberByAdmin");
      generalList = Array.isArray(generalRes.data)
        ? generalRes.data.map((fb) => ({ ...fb, isType: false }))
        : [];
    } catch {
      toast.warn("Feedback trải nghiệm không còn!");
    }

    try {
      const coachRes = await api.get("/Feedback/GetFeedbacksMemberForCoachByAdmin");
      coachList = Array.isArray(coachRes.data)
        ? coachRes.data.map((fb) => ({ ...fb, isType: true }))
        : [];
    } catch {
      toast.warn("Feedback cho coach không còn!");
    }

    setFeedbacks([...generalList, ...coachList]);
    setLoading(false);
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [filterRating, filterKeyword, filterType]);

  const filteredFeedbacks = feedbacks.filter(
    (fb) =>
      (filterRating ? fb.rating === parseInt(filterRating) : true) &&
      (filterKeyword
        ? fb.content?.toLowerCase().includes(filterKeyword.toLowerCase())
        : true) &&
      (filterType !== "" ? String(fb.isType) === filterType : true)
  );

  const paginatedFeedbacks = filteredFeedbacks.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa feedback này?")) return;
    try {
      await api.delete(`/Feedback/DeleteFeedback/${id}`);
      toast.success("Đã xóa feedback!");
      fetchFeedbacks();
    } catch {
      toast.error("Xóa thất bại!");
    }
  };

  const avgRating = filteredFeedbacks.length
    ? (
        filteredFeedbacks.reduce((sum, f) => sum + Number(f.rating || 0), 0) /
        filteredFeedbacks.length
      ).toFixed(2)
    : 0;

  const ratingCounts = feedbacks.reduce((acc, fb) => {
    if (fb.rating) acc[fb.rating] = (acc[fb.rating] || 0) + 1;
    return acc;
  }, {});

  return (
    <Box sx={{ bgcolor: "white", minHeight: "80vh" }}>
      {/* Stats Header */}
      <Box sx={{ p: 3, borderBottom: "1px solid #e0e0e0", bgcolor: "#f8f9fa" }}>
        <Stack direction="row" spacing={4} alignItems="center">
          <Typography variant="body2" color="text.secondary">
            Tổng số đánh giá: <strong>{filteredFeedbacks.length}</strong>
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Điểm trung bình: <strong>{avgRating}</strong>
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            {[5, 4, 3, 2, 1].map((star) => (
              <Typography key={star} variant="body2" color="text.secondary">
                {star}⭐: {ratingCounts[star] || 0}
              </Typography>
            ))}
          </Stack>
        </Stack>
      </Box>

      {/* Filters */}
      <Box
        sx={{
          p: 3,
          borderBottom: "1px solid #e0e0e0",
          display: "flex",
          gap: 2,
          alignItems: "center",
        }}
      >
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Rating</InputLabel>
          <Select
            value={filterRating}
            label="Rating"
            onChange={(e) => setFilterRating(e.target.value)}
          >
            <MenuItem value="">Tất cả</MenuItem>
            {[5, 4, 3, 2, 1].map((r) => (
              <MenuItem key={r} value={r}>
                {r} sao
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Loại</InputLabel>
          <Select
            value={filterType}
            label="Loại"
            onChange={(e) => setFilterType(e.target.value)}
          >
            <MenuItem value="">Tất cả</MenuItem>
            <MenuItem value="false">Feedback trải nghiệm hệ thống</MenuItem>
            <MenuItem value="true">Feedback dành cho Coach</MenuItem>
          </Select>
        </FormControl>

        <TextField
          placeholder="Tìm kiếm"
          variant="outlined"
          size="small"
          value={filterKeyword}
          onChange={(e) => setFilterKeyword(e.target.value)}
          sx={{ maxWidth: 300 }}
        />
      </Box>

      {/* Feedback List */}
      <Box sx={{ p: 0 }}>
        {loading ? (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="body1">Đang tải dữ liệu...</Typography>
          </Box>
        ) : paginatedFeedbacks.length > 0 ? (
          paginatedFeedbacks.map((fb, index) => (
            <Box
              key={fb.feedbackId}
              sx={{
                px: 3,
                py: 2,
                borderBottom:
                  index < paginatedFeedbacks.length - 1
                    ? "1px solid #e0e0e0"
                    : "none",
                "&:hover": { bgcolor: "#f5f5f5" },
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
              >
                <Box sx={{ flex: 1 }}>
                  <Stack direction="row" spacing={2} alignItems="center" mb={1}>
                    <Typography variant="body1" fontWeight="medium">
                      {fb.disPlayName || "Không rõ"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ({fb.isType
                        ? "Feedback dành cho Coach"
                        : "Feedback trải nghiệm hệ thống"})
                    </Typography>
                  </Stack>

                  <Box
                    sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                  >
                    <Rating value={fb.rating} readOnly size="small" />
                  </Box>

                  <Typography variant="body2" sx={{ mb: 1 }}>
                    {fb.content}
                  </Typography>

                  <Typography variant="caption" color="text.secondary">
                    {fb.submittedAt &&
                      new Date(fb.submittedAt).toLocaleString("vi-VN")}
                  </Typography>
                </Box>

                <Tooltip title="Xóa feedback">
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(fb.feedbackId)}
                    sx={{ color: "#f44336" }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Box>
          ))
        ) : (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="h6" color="text.secondary">
              Không tìm thấy feedback
            </Typography>
          </Box>
        )}
      </Box>

      {/* Pagination */}
      <Box display="flex" justifyContent="center" mt={2} pb={4}>
        <Pagination
          count={Math.ceil(filteredFeedbacks.length / rowsPerPage)}
          page={page}
          onChange={(_, v) => setPage(v)}
          color="primary"
        />
      </Box>
    </Box>
  );
}