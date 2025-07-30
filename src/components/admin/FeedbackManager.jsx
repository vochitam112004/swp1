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

  const fetchFeedbacks = async () => {
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
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

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
  const ratingCounts = [5, 4, 3, 2, 1].map(
    (r) => filteredFeedbacks.filter((fb) => fb.rating === r).length
  );

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", mt: 4 }}>
      <Box mb={2}>
        <b>Tổng số đánh giá:</b> {filteredFeedbacks.length} &nbsp;|&nbsp;
        <b>Điểm trung bình:</b> {avgRating}
        <Box mt={1}>
          {ratingCounts.map((cnt, idx) => (
            <span key={idx}>
              {5 - idx}★: {cnt} &nbsp;
            </span>
          ))}
        </Box>
      </Box>

      <Typography variant="h5" mb={2}>
        Quản lý Feedback
      </Typography>

      <Box display="flex" gap={2} mb={2}>
        <FormControl size="small">
          <InputLabel>Rating</InputLabel>
          <Select
            value={filterRating}
            label="Rating"
            onChange={(e) => setFilterRating(e.target.value)}
            sx={{ minWidth: 100 }}
          >
            <MenuItem value="">Tất cả</MenuItem>
            {[5, 4, 3, 2, 1].map((r) => (
              <MenuItem key={r} value={r}>
                {r} sao
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small">
          <InputLabel>Loại</InputLabel>
          <Select
            value={filterType}
            label="Loại"
            onChange={(e) => setFilterType(e.target.value)}
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="">Tất cả</MenuItem>
            <MenuItem value="false">Feedback trải nghiệm hệ thống</MenuItem>
            <MenuItem value="true">Feedback dành cho Coach</MenuItem>
          </Select>
        </FormControl>

        <TextField
          size="small"
          label="Tìm kiếm"
          value={filterKeyword}
          onChange={(e) => setFilterKeyword(e.target.value)}
        />
      </Box>

      {filteredFeedbacks.length === 0 ? (
        <Typography>Không có feedback nào phù hợp.</Typography>
      ) : (
        paginatedFeedbacks.map((fb) => (
          <Box
            key={fb.feedbackId}
            sx={{
              p: 2,
              border: "1px solid #eee",
              mb: 2,
              borderRadius: 2,
              position: "relative",
            }}
          >
            <Typography fontWeight={600}>
              {fb.disPlayName || "(Không có tên)"} (
              {fb.isType ? "Feedback dành cho Coach" : "Feedback trải nghiệm hệ thống"})
            </Typography>
            <Rating value={fb.rating} readOnly size="small" />
            <Typography>{fb.content}</Typography>
            <Typography fontSize={12} color="text.secondary">
              {fb.submittedAt && new Date(fb.submittedAt).toLocaleString()}
            </Typography>
            <IconButton
              sx={{ position: "absolute", top: 8, right: 8 }}
              color="error"
              onClick={() => handleDelete(fb.feedbackId)}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        ))
      )}

      <Box display="flex" justifyContent="center" mt={2}>
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
