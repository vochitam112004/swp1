import React, { useState } from "react";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import axios from "axios"; // Thêm dòng này
import GoogleLogin from "./GoogleLogin"; // Giả sử bạn đã tạo component GoogleLogin
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom"; // Thêm dòng này
export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "/login",
        {
          username: form.username,
          password: form.password,
        }
      );
      toast.success("Đăng nhập thành công!");
      console.log("Login Data:", response.data);

      navigate("/membership"); 
    } catch (error) {
      toast.error("Tên đăng nhập hoặc mật khẩu không đúng!");
      console.error("Login error:", error);
    }
  };

  return (
    // ...existing code...
    <Box
      sx={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Paper elevation={4} sx={{ p: 4, borderRadius: 3, minWidth: 340 }}>
        <Typography variant="h5" fontWeight={700} mb={2} color="primary">
          Đăng nhập
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Tên đăng nhập"
            name="username"
            value={form.username}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Mật khẩu"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Đăng nhập
          </Button>
        </form>
        <Box mt={2}>
          <GoogleLogin />
        </Box>
        {message && (
          <Typography
            color={
              message === "Đăng nhập thành công!"
                ? "success.main"
                : "error.main"
            }
            mt={2}
          >
            {message}
          </Typography>
        )}
      </Paper>
    </Box>
    // ...existing code...
  );
}
