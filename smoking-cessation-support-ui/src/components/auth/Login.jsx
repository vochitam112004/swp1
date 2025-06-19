import React, { useState, useEffect } from "react";
import { Box, Button, TextField, Typography, Paper, IconButton, InputAdornment, Avatar } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import api from "../../api/axios.js";
import GoogleLogin from "./GoogleLogin";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Lấy user từ localStorage nếu đã đăng nhập
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      toast.error("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    try {
      const response = await api.post("/Auth/login", {
        username: form.username,
        password: form.password,
      });
      toast.success("Đăng nhập thành công!");
      // Lưu token vào localStorage
      localStorage.setItem("authToken", response.data.token);
      // Lưu cả id từ backend (nếu có)
      const userData = {
        id: response.data.id, // Thêm dòng này
        username: response.data.username || form.username,
        avatar: response.data.avatar || null,
        token: response.data.token || null,
      };
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      navigate("/membership");
      window.location.reload();
    } catch (error) {
      toast.error("Tên đăng nhập hoặc mật khẩu không đúng!");
      console.error("Login error:", error);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast.info("Đã đăng xuất!");
  };

  if (user) {
    return (
      <Box
        sx={{
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Paper elevation={4} sx={{ p: 4, borderRadius: 3, minWidth: 340, textAlign: "center" }}>
          <Avatar
            src={user.avatar || "https://ui-avatars.com/api/?name=" + encodeURIComponent(user.username)}
            sx={{ width: 64, height: 64, margin: "0 auto", mb: 2 }}
          />
          <Typography variant="h6" fontWeight={700} mb={2}>
            Xin chào, {user.username}
          </Typography>
          <Button
            variant="outlined"
            color="error"
            onClick={handleLogout}
            fullWidth
          >
            Đăng xuất
          </Button>
        </Paper>
      </Box>
    );
  }

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
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
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
      </Paper>
    </Box>
  );
}