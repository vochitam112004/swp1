import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Avatar,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import EmailIcon from "@mui/icons-material/Email";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../api/axios.js";

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
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleClickShowPassword = () => setShowPassword((v) => !v);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(true);

    if (!/\S+@\S+\.\S+/.test(form.email))
      return toast.error("Email không hợp lệ!"), setMessage(false);
    if (form.password.length < 6)
      return toast.error("Mật khẩu phải từ 6 ký tự!"), setMessage(false);
    if (form.password !== confirmPassword)
      return toast.error("Mật khẩu xác nhận không khớp!"), setMessage(false);
    if (!/^0\d{9,10}$/.test(form.phoneNumber))
      return toast.error("Số điện thoại không hợp lệ!"), setMessage(false);

    try {
      await api.post("Auth/register", form);
      toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
      navigate("/login");
    } catch (err) {
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
    <Box sx={{ display: "flex", minHeight: "100vh", fontFamily: 'Poppins, sans-serif' }}>
      <Box
        sx={{
          flex: 1,
          backgroundImage: 'linear-gradient(rgba(33, 147, 176, 0.5), rgba(109, 213, 250, 0.5)), url("/images/backgroup_login.jpg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          color: "#fff",
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          p: 4,
        }}
      >
        <Typography variant="h4" fontWeight="bold" mb={2}>
          Chào mừng bạn đến với nền tảng hỗ trợ cai nghiện thuốc lá
        </Typography>
        <Typography variant="body1" mb={3}>
          Đã có tài khoản?
        </Typography>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#00c6a2",
            color: "#fff",
            fontWeight: "bold",
            px: 4,
            py: 1,
            borderRadius: 9999,
            boxShadow: 3,
            transition: "all 0.3s ease",
            "&:hover": {
              backgroundColor: "#00dfb6",
              transform: "scale(1.05)",
            },
          }}
          onClick={() => navigate("/login")}
        >
          Đăng nhập ngay
        </Button>
      </Box>

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
            maxWidth: 500,
            background: "#fff",
            p: 4,
            borderRadius: 5,
            boxShadow: 4,
          }}
        >
          <Typography variant="h5" fontWeight={700} mb={2} align="center" color="#1e1e1e">
            Đăng ký tài khoản
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="primary" />
                  </InputAdornment>
                ),
              }}
              sx={{ background: "#f5f7fb", borderRadius: 2 }}
            />
            <TextField
              label="Tên đăng nhập"
              name="userName"
              value={form.userName}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon color="primary" />
                  </InputAdornment>
                ),
              }}
              sx={{ background: "#f5f7fb", borderRadius: 2 }}
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
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowPassword} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ background: "#f5f7fb", borderRadius: 2 }}
            />
            <TextField
              label="Nhập lại mật khẩu"
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              fullWidth
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="primary" />
                  </InputAdornment>
                ),
              }}
              sx={{ background: "#f5f7fb", borderRadius: 2 }}
            />
            <TextField
              label="Số điện thoại"
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
              sx={{ background: "#f5f7fb", borderRadius: 2 }}
            />
            <TextField
              label="Địa chỉ"
              name="address"
              value={form.address}
              onChange={handleChange}
              fullWidth
              margin="normal"
              sx={{ background: "#f5f7fb", borderRadius: 2 }}
            />
            <TextField
              label="Tên hiển thị"
              name="displayName"
              value={form.displayName}
              onChange={handleChange}
              fullWidth
              margin="normal"
              sx={{ background: "#f5f7fb", borderRadius: 2 }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 2,
                fontWeight: 700,
                fontSize: "1rem",
                background: "linear-gradient(90deg, #42a5f5 60%, #1976d2 100%)",
                borderRadius: 9999,
                py: 1.3,
                "&:hover": {
                  background: "linear-gradient(90deg, #1976d2 60%, #1565c0 100%)",
                },
              }}
              disabled={message}
            >
              Đăng ký
            </Button>
          </form>
          <Box mt={2} textAlign="center">
            <Typography variant="body2">
              Bạn đã có tài khoản?{" "}
              <Link to="/login" style={{ color: "#2193b0", textDecoration: "none", fontWeight: 600 }}>
                Đăng nhập
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
