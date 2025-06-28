import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
import EmailIcon from "@mui/icons-material/Email";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";

// Modern CSS for the register page
const styles = {
  authBg: {
    minHeight: "100vh",
    width: "100vw",
    display: "flex",
    alignItems: "stretch", 
    justifyContent: "center",
    background: "linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)",
    padding: 0,
    margin: 0,
    overflow: "hidden",
  },
  registerContainer: {
    width: 400,
    maxWidth: "100vw",
    padding: "32px 28px 24px 28px",
    borderRadius: "20px",
    boxShadow: "0 8px 32px rgba(44, 62, 80, 0.18)",
    background: "#fff",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
    margin: 0,
    minHeight: "100vh", 
    justifyContent: "center", 
  },
  registerTitle: {
    fontSize: "2.2rem",
    fontWeight: 800,
    color: "#2193b0",
    marginBottom: "10px",
    letterSpacing: "1.5px",
    textAlign: "center",
    marginTop: 0,
  },
  registerBtn: {
    width: "100%",
    padding: "12px",
    background: "linear-gradient(90deg, #42a5f5 60%, #1976d2 100%)",
    border: "none",
    borderRadius: "10px",
    color: "#fff",
    fontSize: "18px",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "12px",
    marginBottom: "6px",
    transition: "background 0.2s",
    boxShadow: "0 2px 8px rgba(33,147,176,0.10)",
  },
  googleBtnWrapper: {
    width: "100%",
    margin: "8px 0",
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
          sx={{
            width: 64,
            height: 64,
            mb: 1,
            bgcolor: "#2193b0",
            boxShadow: "0 2px 8px #2193b033",
          }}
        />
        <div style={styles.registerTitle}>Đăng ký tài khoản</div>
        <form
          onSubmit={handleSubmit}
          style={{
            width: "100%",
            margin: 0,
            padding: 0,
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          <TextField
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            fullWidth
            margin="none"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon color="primary" />
                </InputAdornment>
              ),
            }}
            sx={{
              background: "#f7fafc",
              borderRadius: 2,
            }}
          />
          <TextField
            label="Tên đăng nhập"
            name="userName"
            value={form.userName}
            onChange={handleChange}
            fullWidth
            margin="none"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon color="primary" />
                </InputAdornment>
              ),
            }}
            sx={{
              background: "#f7fafc",
              borderRadius: 2,
            }}
          />
          <TextField
            label="Mật khẩu"
            name="password"
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={handleChange}
            fullWidth
            margin="none"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon color="primary" />
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
            sx={{
              background: "#f7fafc",
              borderRadius: 2,
            }}
          />
          <TextField
            label="Nhập lại mật khẩu"
            name="confirmPassword"
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
            margin="none"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon color="primary" />
                </InputAdornment>
              ),
            }}
            sx={{
              background: "#f7fafc",
              borderRadius: 2,
            }}
          />
          <TextField
            label="Số điện thoại"
            name="phoneNumber"
            value={form.phoneNumber}
            onChange={handleChange}
            fullWidth
            margin="none"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <i className="fas fa-phone" style={{ color: "#2193b0" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              background: "#f7fafc",
              borderRadius: 2,
            }}
          />
          <TextField
            label="Địa chỉ"
            name="address"
            value={form.address}
            onChange={handleChange}
            fullWidth
            margin="none"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <i className="fas fa-map-marker-alt" style={{ color: "#2193b0" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              background: "#f7fafc",
              borderRadius: 2,
            }}
          />
          <TextField
            label="Tên hiển thị"
            name="displayName"
            value={form.displayName}
            onChange={handleChange}
            fullWidth
            margin="none"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <i className="fas fa-id-card" style={{ color: "#2193b0" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              background: "#f7fafc",
              borderRadius: 2,
            }}
          />
          <Button
            type="submit"
            variant="contained"
            sx={{
              mt: 1,
              borderRadius: 3,
              fontWeight: 700,
              fontSize: "1rem",
              background: "linear-gradient(90deg, #42a5f5 60%, #1976d2 100%)",
              boxShadow: 2,
              py: 1.2,
              "&:hover": {
                background: "linear-gradient(90deg, #1976d2 60%, #1565c0 100%)",
              },
            }}
            disabled={message}
            fullWidth
          >
            Đăng ký
          </Button>
        </form>
        <Box mt={2} textAlign="center" width="100%">
          <Typography variant="body2">
            Đã có tài khoản?{" "}
            <Link
              to="/login"
              style={{
                color: "#2193b0",
                cursor: "pointer",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Đăng nhập
            </Link>
          </Typography>
        </Box>
      </div>
    </div>
  );
}