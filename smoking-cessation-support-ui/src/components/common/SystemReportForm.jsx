import React, { useState } from "react";
import { toast } from "react-toastify";
import api from "../../api/axios";
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Typography,
  CircularProgress,
} from "@mui/material";

export default function SystemReportForm() {
  const [type, setType] = useState("");
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);

  const userName = localStorage.getItem("username") || "Guest";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!type || !details.trim()) {
      toast.error("Vui lòng chọn loại báo cáo và nhập nội dung!");
      return;
    }
    setLoading(true);
    try {
      await api.post("/SystemReport", {
        reportType: type,
        userName,
        reportedAt: new Date().toISOString(),
        details,
      });
      toast.success("Đã gửi báo cáo hệ thống!");
      setType("");
      setDetails("");
    } catch {
      toast.error("Gửi báo cáo thất bại!");
    }
    setLoading(false);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        maxWidth: 600,
        margin: "0 auto",
        p: 4,
        bgcolor: "#fff",
        borderRadius: 3,
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        mt: 8,
      }}
    >
      <Typography variant="h5" color="primary" fontWeight="bold" gutterBottom>
        Gửi báo cáo hệ thống
      </Typography>

      <TextField
        fullWidth
        select
        label="Loại báo cáo"
        value={type}
        onChange={(e) => setType(e.target.value)}
        sx={{ mb: 3 }}
        required
      >
        <MenuItem value="">-- Chọn loại --</MenuItem>
        <MenuItem value="bug">🐞 Lỗi hệ thống</MenuItem>
        <MenuItem value="feedback">💬 Góp ý</MenuItem>
        <MenuItem value="abuse">🚫 Báo cáo vi phạm</MenuItem>
        <MenuItem value="other">📌 Khác</MenuItem>
      </TextField>

      <TextField
        fullWidth
        label="Nội dung"
        multiline
        rows={5}
        value={details}
        onChange={(e) => setDetails(e.target.value)}
        placeholder="Mô tả chi tiết vấn đề bạn gặp phải..."
        sx={{ mb: 3 }}
        required
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={loading}
        fullWidth
      >
        {loading ? <CircularProgress size={20} color="inherit" /> : "Gửi báo cáo"}
      </Button>
    </Box>
  );
}
