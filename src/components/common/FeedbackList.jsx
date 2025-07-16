import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Rating,
  Pagination,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import api from "../../api/axios";
import { toast } from "react-toastify";

export default function FeedbackList({ refreshTrigger }) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState(null);
  const rowsPerPage = 4;

  const fetchFeedbacks = () => {
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
  };

  useEffect(() => {
    fetchFeedbacks();
  }, [refreshTrigger]);

  const handleDelete = async (FeedbackId) => {
    if (!window.confirm("Bạn có chắc muốn xoá feedback này?")) return;
    try {
      await api.delete(`/Feedback/DeleteFeedback/${FeedbackId}`);
      toast.success("Đã xoá feedback!");
      fetchFeedbacks();
    } catch {
      toast.error("Xoá thất bại!");
    }
  };

  const handleSaveEdit = async () => {
    try {
      await api.put(`/Feedback/UpdateFeedbackById/${editing.feedbackId}`, {
        isType: false,
        rating: editing.rating || 0,
        content: editing.content,
      });
      toast.success("Đã cập nhật!");
      setEditing(null);
      fetchFeedbacks();
    } catch {
      toast.error("Cập nhật thất bại!");
    }
  };

  const paginatedFeedbacks = feedbacks.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

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
          <Paper key={fb.feedbackId || idx} sx={{ p: 2, mb: 2, position: "relative" }}>
            <Typography fontWeight={600}>Đánh giá trải nghiệm hệ thống</Typography>
            <Typography>
              <strong>{fb.disPlayName || "Ẩn danh"}</strong> - {fb.rating}⭐
            </Typography>
            <Typography>{fb.content || "Không có nhận xét"}</Typography>
            <Typography fontSize={12} color="text.secondary">
              {fb.submittedAt && new Date(fb.submittedAt).toLocaleString()}
            </Typography>
            <Box position="absolute" top={8} right={8}>
              <IconButton onClick={() => setEditing(fb)}>
                <EditIcon />
              </IconButton>
              <IconButton color="error" onClick={() => handleDelete(fb.feedbackId)}>
                <DeleteIcon />
              </IconButton>
            </Box>
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

      {/* Modal cập nhật */}
      <Dialog open={!!editing} onClose={() => setEditing(null)}>
        <DialogTitle>Cập nhật Feedback</DialogTitle>
        <DialogContent>
          <Rating
            value={editing?.rating || 0}
            onChange={(_, value) =>
              setEditing((prev) => ({ ...prev, rating: value }))
            }
          />
          <TextField
            fullWidth
            multiline
            minRows={3}
            label="Nội dung"
            value={editing?.content || ""}
            onChange={(e) =>
              setEditing((prev) => ({ ...prev, content: e.target.value }))
            }
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditing(null)}>Huỷ</Button>
          <Button variant="contained" onClick={handleSaveEdit}>
            Lưu
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
