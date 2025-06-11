import React, { useState } from "react";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Giả lập thông tin đăng nhập đúng
    const validUsername = "admin";
    const validPassword = "123456";

    if (form.username === validUsername && form.password === validPassword) {
      setMessage("Đăng nhập thành công!");
      console.log("Login Data:", form);
    } else {
      setMessage("Tên đăng nhập hoặc mật khẩu không đúng!");
    }
  };

  return (
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
  );
}