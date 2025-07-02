import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  Avatar,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import api from "../../api/axios.js";
import GoogleLogin from "./GoogleLogin";
import { useAuth } from "./AuthContext.jsx";
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { user, login, logout } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleClickShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

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

      if (!response.data || !response.data.token || !response.data.user) {
        toast.error("Đăng nhập thất bại. Vui lòng thử lại!");
        return;
      }

      const u = response.data.user;
      const userData = {
        id: u.userId,
        username: u.username,
        email: u.email,
        displayName: u.displayName,
        avatar: u.avatarUrl,
        userType: u.userType,
        phoneNumber: u.phoneNumber,
        address: u.address,
        isActive: u.isActive,
        createdAt: u.createdAt,
        updatedAt: u.updatedAt,
        token: response.data.token,
      };

      localStorage.setItem("authToken", response.data.token);
      localStorage.setItem("user", JSON.stringify(userData));
      login(userData);
      toast.success("Đăng nhập thành công!");
      switch (u.userType) {
        case "Admin":
          navigate("/admin");
          break;
        case "Coach":
          navigate("/coach");
          break;
        default:
          navigate("/dashboard");
          break;
      }
    } catch (error) {
      toast.error("Tên đăng nhập hoặc mật khẩu không đúng!");
      console.error("Login error:", error);
    }
  };

  // ✅ Nếu đã đăng nhập, hiện avatar và nút đăng xuất
  if (user) {
    return (
      <Box className="auth-bg" sx={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Box sx={{ textAlign: "center", p: 4, background: "#fff", borderRadius: 4, boxShadow: 2 }}>
          <Avatar
            src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}`}
            sx={{ width: 64, height: 64, margin: "0 auto", mb: 2 }}
          />
          <Typography variant="h6" fontWeight={700} mb={2}>
            Xin chào, {user.username}
          </Typography>
         <Button
  variant="outlined"
  color="error"
  onClick={() => {
    logout();
    navigate("/");
  }}
  fullWidth
>
  Đăng xuất
</Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", fontFamily: 'Poppins, sans-serif' }}>
      {/* ✅ Bên trái: Hình nền với overlay và lời chào */}
      <Box
        sx={{
          flex: 1,
          backgroundImage: 'linear-gradient(rgba(43, 180, 227, 0.4), rgba(43, 180, 227, 0.4)), url("/images/backgroup_login.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          color: "#fff",
          display: { xs: 'none', md: 'flex' }, // ✅ Ẩn trên thiết bị nhỏ
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          p: 4,
        }}
      >
        <Typography variant="h4" fontWeight="bold" mb={2} color="#ffffff">
          Chào mừng bạn đến với nền tảng hỗ trợ cai nghiện thuốc lá
        </Typography>
        <Typography variant="body1" mb={3}>
          Bạn chưa có tài khoản?
        </Typography>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#00c6a2", // ✅ Nút xanh ngọc
            color: "#fff",
            fontWeight: "bold",
            px: 4,
            py: 1,
            borderRadius: 9999,
            boxShadow: 3,
            transition: "all 0.3s ease",
            '&:hover': {
              backgroundColor: "#00dfb6",
              transform: "scale(1.05)"
            },
          }}
          onClick={() => navigate("/register")}
        >
          Đăng ký ngay
        </Button>
      </Box>

      {/* ✅ Bên phải: Form đăng nhập hiện đại */}
      <Box
        sx={{
          flex: 1,
          background: "#f4f7f9",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 400,
            background: "#fff",
            p: 4,
            borderRadius: 5,
            boxShadow: 4,
          }}
        >
          <Typography variant="h5" fontWeight={700} mb={2} color="#1e1e1e" align="center">
            Đăng nhập
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              label="Tên đăng nhập hoặc Email"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutlineIcon color="primary" />
                  </InputAdornment>
                ),
                style: {
                  background: "#f5f7fb", // ✅ Nền input sáng
                  borderRadius: 10,       // ✅ Bo góc input
                },
              }}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Mật khẩu"
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowPassword} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
                style: {
                  background: "#f5f7fb",
                  borderRadius: 10,
                },
              }}
            />
            <Box textAlign="right" mt={1}>
              <Typography
                variant="body2"
                sx={{ cursor: "pointer", color: "#1976d2", textDecoration: "underline" }}
                onClick={() => navigate("/forgot-password")}
              >
                Quên mật khẩu?
              </Typography>
            </Box>
            <Box mt={2}>
              <Button
                fullWidth
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: "#2b7de9", // ✅ Màu chính
                  fontWeight: "bold",
                  borderRadius: 9999,
                  boxShadow: 2,
                  transition: "all 0.3s ease",
                  '&:hover': {
                    backgroundColor: "#125fd5",
                    transform: "scale(1.02)"
                  },
                }}
              >
                Đăng nhập
              </Button>
            </Box>
            <Box mt={2} display="flex" justifyContent="center">
              <GoogleLogin />
            </Box>
          </form>
        </Box>
      </Box>
    </Box>
  );
}
