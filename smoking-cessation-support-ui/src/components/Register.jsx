import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Divider,
} from "@mui/material";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    email: "",
    phone: "",
    address: "",
    nameDisplay: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("Đăng ký thành công!");
    console.log("Form Data:", form);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(120deg, #e0eafc 0%, #cfdef3 100%)",
      }}
    >
      <Paper
        elevation={8}
        sx={{
          p: { xs: 3, sm: 5 },
          borderRadius: 5,
          maxWidth: 400,
          width: "100%",
        }}
      >
        <Typography variant="h5" fontWeight={700} color="primary" mb={2}>
          Đăng ký
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
          <TextField
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Số điện thoại"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Địa chỉ"
            name="address"
            value={form.address}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Tên hiển thị"
            name="nameDisplay"
            value={form.nameDisplay}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Đăng ký
          </Button>
        </form>
        {message && (
          <Typography color="success.main" mt={2}>
            {message}
          </Typography>
        )}
      </Paper>
    </Box>
  );
}