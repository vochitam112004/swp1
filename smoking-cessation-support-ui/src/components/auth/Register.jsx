import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios.js";
import { toast } from "react-toastify";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
} from "@mui/material";

export default function Register() {
  const [form, setForm] = useState({
    userName: "",
    password: "",
    email: "",
    phoneNumber: "",
    address: "",
    displayName: "",
  });
  const [message, setMessage] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(true);

    try {
      console.log("Register payload:", form);
      const response = await api.post("Auth/register", form);
      console.log(response);

      toast.success("Successfully registered! Please log in.");
      navigate("/login");
    } catch (err) {
      console.error("Registration error:", err);
      toast.error(
        err.response?.data?.message ||
          JSON.stringify(err.response?.data) ||
          "Đăng ký thất bại!"
      );
    } finally {
      setMessage(false);
    }
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
            name="userName"
            value={form.userName}
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
            name="phoneNumber"
            value={form.phoneNumber}
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
            name="displayName"
            value={form.displayName}
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