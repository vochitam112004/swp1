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
  InputAdornment,
  IconButton,
  Avatar,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import GoogleLogin from "./GoogleLogin";

// Modern CSS for the register page
const styles = {
  authBg: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #74ebd5 0%, #ACB6E5 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  registerContainer: {
    background: "#fff",
    padding: "40px 32px",
    borderRadius: "18px",
    boxShadow: "0 8px 32px rgba(44, 62, 80, 0.18)",
    width: "370px",
    maxWidth: "95vw",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  registerTitle: {
    fontSize: "2rem",
    fontWeight: 700,
    color: "#2193b0",
    marginBottom: "18px",
    letterSpacing: "1px",
    textAlign: "center",
  },
  registerBtn: {
    width: "100%",
    padding: "12px",
    background: "linear-gradient(90deg, #74ebd5 0%, #2193b0 100%)",
    border: "none",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "18px",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "18px",
    marginBottom: "8px",
    transition: "background 0.2s",
    boxShadow: "0 2px 8px rgba(33,147,176,0.08)",
  },
  googleBtnWrapper: {
    width: "100%",
    margin: "12px 0",
    display: "flex",
    justifyContent: "center",
  },
};

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
    <div style={styles.authBg}>
      <div style={styles.registerContainer}>
        <Avatar
          src="/logo192.png"
          sx={{ width: 64, height: 64, mb: 2, bgcolor: "#2193b0", boxShadow: "0 2px 8px #2193b033" }}
        />
        <div style={styles.registerTitle}>Đăng ký tài khoản</div>
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <TextField
            label="Tên đăng nhập"
            name="userName"
            value={form.userName}
            onChange={handleChange}
            fullWidth
            margin="dense"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <i className="fas fa-user" style={{ color: "#2193b0" }} />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Mật khẩu"
            name="password"
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={handleChange}
            fullWidth
            margin="dense"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <i className="fas fa-lock" style={{ color: "#2193b0" }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    edge="end"
                    size="small"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Xác nhận mật khẩu"
            name="confirmPassword"
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
            margin="dense"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <i className="fas fa-lock" style={{ color: "#2193b0" }} />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            fullWidth
            margin="dense"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <i className="fas fa-envelope" style={{ color: "#2193b0" }} />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Số điện thoại"
            name="phoneNumber"
            value={form.phoneNumber}
            onChange={handleChange}
            fullWidth
            margin="dense"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <i className="fas fa-phone" style={{ color: "#2193b0" }} />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Địa chỉ"
            name="address"
            value={form.address}
            onChange={handleChange}
            fullWidth
            margin="dense"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <i className="fas fa-map-marker-alt" style={{ color: "#2193b0" }} />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Tên hiển thị"
            name="displayName"
            value={form.displayName}
            onChange={handleChange}
            fullWidth
            margin="dense"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <i className="fas fa-id-card" style={{ color: "#2193b0" }} />
                </InputAdornment>
              ),
            }}
          />
          <button
            type="submit"
            style={styles.registerBtn}
            disabled={message}
          >
            Đăng ký
          </button>
        </form>
        <div style={styles.googleBtnWrapper}>
          <GoogleLogin />
        </div>
        <Box mt={2} textAlign="center">
          <Typography variant="body2">
            Đã có tài khoản?{" "}
            <span
              style={{ color: "#2193b0", cursor: "pointer", fontWeight: 600 }}
              onClick={() => navigate("/login")}
            >
              Đăng nhập
            </span>
          </Typography>
        </Box>
      </div>
    </div>
  );
}