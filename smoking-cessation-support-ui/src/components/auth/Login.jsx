import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
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
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';

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

  if (user) {
    return (
      <div className="auth-bg">
        <div className="register-container" style={{ minWidth: 340, textAlign: "center" }}>
          <Avatar
            src={
              user.avatar ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}`
            }
            sx={{ width: 64, height: 64, margin: "0 auto", mb: 2 }}
          />
          <Typography variant="h6" fontWeight={700} mb={2}>
            Xin chào, {user.username}
          </Typography>
          <Button variant="outlined" color="error" onClick={logout} fullWidth>
            Đăng xuất
          </Button>
        </div>
      </div>
    );
  }

  return (
       <Box
      className="auth-bg"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)',
      }}
    >
      <Box
        className="register-container"
        sx={{
          width: 350,
          p: 2, // giảm padding
          borderRadius: 4,
          boxShadow: 3,
          background: '#fff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 0, // loại bỏ gap
        }}
      >
        <Avatar sx={{ bgcolor: '#1976d2', width: 48, height: 48, mb: 1 }} />
        <Typography variant="h5" fontWeight={700} mb={1}>
          Đăng nhập
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: "100%", margin: 0, padding: 0 }}>
          <TextField
            fullWidth
            margin="dense"
            label="Tên đăng nhập"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
            InputProps={{
              style: { background: "#fff", borderRadius: 8 },
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon color="primary" />
                </InputAdornment>
              ),
            }}
            sx={{ mb: 1 }}
          />
          <TextField
            fullWidth
            margin="dense"
            label="Mật khẩu"
            name="password"
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={handleChange}
            required
            InputProps={{
              style: { background: "#fff", borderRadius: 8 },
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon color="primary" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowPassword}
                    edge="end"
                    aria-label="toggle password visibility"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ mb: 1 }}
          />
          <Box textAlign="right" mt={0} mb={1}>
            <Typography
              variant="body2"
              color="textSecondary"
              sx={{ cursor: "pointer", textDecoration: "underline" }}
              onClick={() => navigate("/forgot-password")}
            >
              Forgot password?
            </Typography>
          </Box>
          <Button
            fullWidth
            variant="contained"
            sx={{
              mt: 1,
              borderRadius: 2,
              fontWeight: 600,
              background: 'linear-gradient(90deg, #1976d2 60%, #42a5f5 100%)',
              boxShadow: 2,
              '&:hover': { background: 'linear-gradient(90deg, #1565c0 60%, #1976d2 100%)' },
            }}
            type="submit"
          >
            Đăng nhập
          </Button>
          <div style={{ width: "100%", marginTop: 8, display: "flex", justifyContent: "center" }}>
            <GoogleLogin />
             </div>
               </form>
        <Typography mt={1} fontSize={14}>
          Chưa có tài khoản?{' '}
          <Link to="/register" style={{ color: '#1976d2', fontWeight: 600 }}>
            Đăng ký
          </Link>
        </Typography>
      </Box>
    </Box>
  );
}