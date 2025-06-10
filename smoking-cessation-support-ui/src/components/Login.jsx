import React, { useState } from "react";
import { Box, Button, TextField, Typography, Paper, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("Đăng nhập thành công!");
  };

  // Giả lập đăng nhập Google
  const handleGoogleLogin = () => {
    setMessage("Đăng nhập bằng Google thành công!");
  };

  const handleRegisterRedirect = () => {
    navigate("/register");
  };

  return (
    <Box
      sx={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "transparent",
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
            sx={{ mt: 2, fontWeight: 600, borderRadius: 2 }}
          >
            Đăng nhập
          </Button>
        </form>
        <Divider sx={{ my: 2 }}>hoặc</Divider>
        <Button
          variant="outlined"
          color="error"
          fullWidth
          startIcon={
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png"
              alt="Google"
              style={{ width: 20, height: 20 }}
            />
          }
          onClick={handleGoogleLogin}
          sx={{ mb: 1, fontWeight: 600, borderRadius: 2 }}
        >
          Đăng nhập bằng Google
        </Button>
        <Box mt={2} textAlign="center">
          <Typography variant="body2">
            Chưa có tài khoản?{" "}
            <Button variant="text" onClick={handleRegisterRedirect}>
              Đăng ký
            </Button>
          </Typography>
        </Box>
        {message && (
          <Typography color="success.main" mt={2}>
            {message}
          </Typography>
        )}
      </Paper>
    </Box>
  );
}