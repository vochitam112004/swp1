// src/pages/Admin/AdminDashboard.jsx
import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
} from "@mui/material";
import { toast } from "react-toastify";
import api from "../../api/axios";

export default function AdminPage() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    email: "",
    displayName: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreateCoach = async () => {
    if (!form.username || !form.password || !form.email || !form.displayName) {
      toast.error("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    try {
      const response = await api.post("/Auth/register", {
        ...form,
        userType: "coach", // đảm bảo backend nhận đúng vai trò
      });

      toast.success("Tạo Coach thành công!");
      setForm({ username: "", password: "", email: "", displayName: "" });
    } catch (error) {
      toast.error("Lỗi khi tạo Coach!");
      console.error(error);
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h4" mb={3} color="primary">
        Quản trị viên: Tạo tài khoản Coach
      </Typography>
      <Paper elevation={3} sx={{ p: 3, maxWidth: 500 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Tên người dùng"
              name="username"
              fullWidth
              value={form.username}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Mật khẩu"
              name="password"
              type="password"
              fullWidth
              value={form.password}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Email"
              name="email"
              fullWidth
              value={form.email}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Tên hiển thị"
              name="displayName"
              fullWidth
              value={form.displayName}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" onClick={handleCreateCoach} fullWidth>
              Tạo Coach
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}
