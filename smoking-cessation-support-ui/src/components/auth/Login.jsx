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
import { useNavigate } from "react-router-dom";
import api from "../../api/axios.js";
import GoogleLogin from "./GoogleLogin";
import { useAuth } from "./AuthContext.jsx";

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
      login(userData);
      toast.success("Đăng nhập thành công!");
      navigate("/membership");
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
    <div className="auth-split">
      <div className="auth-split-left">
        <div className="auth-split-logo">
          <img src="/logo192.png" alt="Logo" />
        </div>
        <div className="auth-split-title">
          SMOKING<br />SUPPORT
        </div>
      </div>
      <div className="auth-split-right">
        <div className="register-container">
          <div className="register-title">
            Log in
          </div>
          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <TextField
              label="Email address"
              name="username"
              value={form.username}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              InputProps={{
                style: { background: "#fff", borderRadius: 8 }
              }}
            />
            <TextField
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              InputProps={{
                style: { background: "#fff", borderRadius: 8 },
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
            />
            <Box textAlign="right" mt={1} mb={2}>
              <Typography
                variant="body2"
                color="textSecondary"
                sx={{ cursor: "pointer", textDecoration: "underline" }}
                onClick={() => navigate("/forgot-password")}
              >
                Forgot password?
              </Typography>
            </Box>
            <button className="register-btn" type="submit">
              Log in
            </button>
          </form>
          <div style={{ margin: "32px 0 0 0", fontWeight: 700, fontSize: "1.2rem", color: "#222", width: "100%", textAlign: "left" }}>
            Register
          </div>
          <button
            className="register-btn create-account-btn"
            type="button"
            onClick={() => navigate("/register")}
          >
            Create an account
          </button>
        </div>
      </div>
    </div>
  );
}
