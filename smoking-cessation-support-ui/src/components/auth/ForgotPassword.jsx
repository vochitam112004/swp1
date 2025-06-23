import React, { useState } from "react";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import { toast } from "react-toastify";
import api from "../../api/axios";

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: email, 2: otp, 3: new password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSendOTP = async () => {
    if (!email) return toast.error("Vui lòng nhập email!");
    try {
      await api.post("/Auth/request-reset", { email }); // ⬅️ bạn đổi path theo backend
      toast.success("Đã gửi mã OTP đến email!");
      setStep(2);
    } catch {
      toast.error("Gửi OTP thất bại!");
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp) return toast.error("Vui lòng nhập mã OTP!");
    try {
      await api.post("/Auth/verify-otp", { otpCode: otp }); // ⬅️ bạn đổi path theo backend
      toast.success("Xác thực OTP thành công!");
      setStep(3);
    } catch {
      toast.error("Mã OTP không đúng hoặc đã hết hạn!");
    }
  };

  const handleResetPassword = async () => {
    if (newPassword.length < 6) return toast.error("Mật khẩu phải tối thiểu 6 ký tự!");
    if (newPassword !== confirmPassword) return toast.error("Mật khẩu không khớp!");
    try {
      await api.post("/Auth/reset-password", { email, otpCode: otp , newPassword }); // ⬅️ path tùy backend
      toast.success("Đặt lại mật khẩu thành công!");
      setStep(1);
      setEmail("");
      setOtp("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      toast.error("Không thể đặt lại mật khẩu!");
    }
  };

  return (
    <Box minHeight="80vh" display="flex" alignItems="center" justifyContent="center">
      <Paper sx={{ p: 4, borderRadius: 3, minWidth: 360 }}>
        <Typography variant="h5" fontWeight={700} mb={2} color="primary">
          Quên mật khẩu
        </Typography>

        {step === 1 && (
          <>
            <TextField
              label="Email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              margin="normal"
            />
            <Button variant="contained" fullWidth onClick={handleSendOTP}>
              Gửi mã OTP
            </Button>
          </>
        )}

        {step === 2 && (
          <>
            <Typography>Nhập mã OTP đã gửi đến email của bạn:</Typography>
            <TextField
              label="Mã OTP"
              fullWidth
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              margin="normal"
            />
            <Button variant="contained" fullWidth onClick={handleVerifyOTP}>
              Xác nhận OTP
            </Button>
          </>
        )}

        {step === 3 && (
          <>
            <TextField
              label="Mật khẩu mới"
              type="password"
              fullWidth
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              margin="normal"
            />
            <TextField
              label="Nhập lại mật khẩu mới"
              type="password"
              fullWidth
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              margin="normal"
            />
            <Button variant="contained" fullWidth onClick={handleResetPassword}>
              Đặt lại mật khẩu
            </Button>
          </>
        )}
      </Paper>
    </Box>
  );
}
