import React, { useState, useEffect } from "react";
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

      console.log("Login API response:", response.data); 

      if (!response.data || !response.data.token) {
        toast.error("Đăng nhập thất bại. Vui lòng thử lại!");
        return;
      }

      const userData = {
        id: response.data.id,
        username: response.data.username || form.username,
        avatar: response.data.avatar || null,
        token: response.data.token || null,
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

  // Cập nhật thông tin
  const handleUpdateProfile = async () => {
    try {
      await api.put("/MemberProfile/update", form);
      toast.success("Cập nhật thông tin thành công!");
    } catch (error) {
      toast.error("Cập nhật thông tin thất bại!");
      console.error("Update profile error:", error);
    }
  };

  // Đổi mật khẩu
  const handleChangePassword = async (userId, oldPassword, newPassword) => {
    try {
      await api.post("/Auth/change-password", { userId, oldPassword, newPassword });
      toast.success("Đổi mật khẩu thành công!");
    } catch (error) {
      toast.error("Đổi mật khẩu thất bại!");
      console.error("Change password error:", error);
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await api.get(`/Membership/history/${user.id}`);
        setForm({
          username: response.data.username || "",
          password: "",
        });
      } catch (error) {
        console.error("Fetch user profile error:", error);
      }
    };

    if (user && user.id) {
      fetchUserProfile();
    }
  }, [user]);

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
        <Paper
          elevation={4}
          sx={{ p: 4, borderRadius: 3, minWidth: 340, textAlign: "center" }}
        >
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
