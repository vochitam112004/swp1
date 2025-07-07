import React, { useEffect, useState } from "react";
import { Box, Button, Modal, TextField, Typography, Rating, IconButton, MenuItem, Select, InputLabel, FormControl } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import api from "../../api/axios";
import { toast } from "react-toastify";
import Pagination from "@mui/material/Pagination";

export default function FeedbackManager() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [editing, setEditing] = useState(null);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const [filterRating, setFilterRating] = useState("");
  const [filterKeyword, setFilterKeyword] = useState("");

  // Nếu backend hỗ trợ filter:
  const fetchFeedbacks = async () => {
    try {
      const params = [];
      if (filterRating) params.push(`rating=${filterRating}`);
      if (filterKeyword) params.push(`keyword=${encodeURIComponent(filterKeyword)}`);
      const query = params.length ? "?" + params.join("&") : "";
      const res = await api.get(`/Feedback${query}`);
      setFeedbacks(res.data.items || res.data);
    } catch {
      toast.error("Không thể tải feedback!");
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, [filterRating, filterKeyword, page]);

  // Nếu backend KHÔNG hỗ trợ phân trang, dùng phía client:
  const paginatedFeedbacks = feedbacks.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  // Lưu chỉnh sửa
  const handleSaveEdit = async () => {
    try {
      await api.put(`/Feedback/${editing.feedbackId}`, {
        rating: editing.rating,
        comment: editing.comment,
      });
      toast.success("Đã cập nhật feedback!");
      setEditing(null);
      fetchFeedbacks();
    } catch {
      toast.error("Cập nhật thất bại!");
    }
  };

  // Hàm xóa feedback
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa feedback này?")) return;
    try {
      await api.delete(`/Feedback/${id}`);
      toast.success("Đã xóa feedback!");
      fetchFeedbacks();
    } catch {
      toast.error("Xóa thất bại!");
    }
  };

  const avgRating = feedbacks.length
    ? (feedbacks.reduce((sum, f) => sum + Number(f.rating || 0), 0) / feedbacks.length).toFixed(2)
    : 0;
  const ratingCounts = [5, 4, 3, 2, 1].map(r => feedbacks.filter(fb => fb.rating === r).length);

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", mt: 4 }}>
      <Box mb={2}>
        <b>Tổng số đánh giá:</b> {feedbacks.length} &nbsp;|&nbsp;
        <b>Điểm trung bình:</b> {avgRating}
        <Box mt={1}>
          {ratingCounts.map((cnt, idx) => (
            <span key={idx}>{5 - idx}★: {cnt} &nbsp;</span>
          ))}
        </Box>
      </Box>
      <Typography variant="h5" mb={2}>Quản lý Feedback</Typography>
      <Box display="flex" gap={2} mb={2}>
        <FormControl size="small">
          <InputLabel>Rating</InputLabel>
          <Select
            value={filterRating}
            label="Rating"
            onChange={e => setFilterRating(e.target.value)}
            sx={{ minWidth: 100 }}
          >
            <MenuItem value="">Tất cả</MenuItem>
            {[5, 4, 3, 2, 1].map(r => (
              <MenuItem key={r} value={r}>{r} sao</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          size="small"
          label="Tìm kiếm"
          value={filterKeyword}
          onChange={e => setFilterKeyword(e.target.value)}
        />
      </Box>
      {paginatedFeedbacks.map((fb) => (
        <Box key={fb.feedbackId} sx={{ p: 2, border: "1px solid #eee", mb: 2, borderRadius: 2, position: "relative" }}>
          <Typography fontWeight={600}>{fb.userName || "Ẩn danh"}</Typography>
          <Rating value={fb.rating} readOnly size="small" />
          <Typography>{fb.comment}</Typography>
          <IconButton sx={{ position: "absolute", top: 8, right: 48 }} onClick={() => setEditing({ ...fb })}>
            <EditIcon />
          </IconButton>
          <IconButton sx={{ position: "absolute", top: 8, right: 8 }} color="error" onClick={() => handleDelete(fb.feedbackId)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      ))}
      <Box display="flex" justifyContent="center" mt={2}>
        <Pagination
          count={Math.ceil(feedbacks.length / rowsPerPage)}
          page={page}
          onChange={(_, v) => setPage(v)}
          color="primary"
        />
      </Box>
      {/* Modal chỉnh sửa */}
      <Modal open={!!editing} onClose={() => setEditing(null)}>
        <Box sx={{ p: 3, bgcolor: "#fff", borderRadius: 2, minWidth: 320, mx: "auto", mt: "10%" }}>
          <Typography variant="h6" mb={2}>Chỉnh sửa Feedback</Typography>
          <Rating
            value={editing?.rating || 0}
            onChange={(_, v) => setEditing(e => ({ ...e, rating: v }))}
          />
          <TextField
            label="Nhận xét"
            value={editing?.comment || ""}
            onChange={e => setEditing(ed => ({ ...ed, comment: e.target.value }))}
            fullWidth
            multiline
            sx={{ my: 2 }}
          />
          <Button variant="contained" onClick={handleSaveEdit}>Lưu</Button>
          <Button variant="text" onClick={() => setEditing(null)} sx={{ ml: 2 }}>Hủy</Button>
        </Box>
      </Modal>
    </Box>
  );
}