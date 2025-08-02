import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid
} from "@mui/material";
import { toast } from "react-toastify";
import api from "../../../api/axios";

export default function AccountTab({ profile, setProfile }) {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(profile);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [passwords, setPasswords] = useState({ old: "", new1: "", new2: "" });

  // Handle profile update
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append("UserName", form.username || "");
    formData.append("DisplayName", form.displayName || "");
    formData.append("Email", form.email || "");
    formData.append("PhoneNumber", form.phoneNumber || "");
    formData.append("Address", form.address || "");
    formData.append("IsActive", form.isActive ?? true);

    try {
      await api.put("/User/My-Update", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Cập nhật thông tin thành công!");
      setProfile({ ...profile, ...form });
      setIsEditing(false);
    } catch (err) {
      console.log(err);
      toast.error("Cập nhật thất bại!");
    }
  };

  // Password change functions
  const requestOtp = async () => {
    try {
      await api.post("/User/request-change-password-otp");
      toast.success("Đã gửi mã OTP đến email!");
      setStep(2);
    } catch (error) {
      console.error("❌ OTP Error:", error);
      toast.error(error.response?.data?.message || "Gửi OTP thất bại! Vui lòng kiểm tra email và thử lại.");
    }
  };

  const handleChangePasswordWithOtp = async (e) => {
    e.preventDefault();
    if (passwords.new1.length < 6) {
      toast.error("Mật khẩu mới phải từ 6 ký tự!");
      return;
    }
    if (passwords.new1 !== passwords.new2) {
      toast.error("Mật khẩu mới không khớp!");
      return;
    }
    try {
      await api.post("/User/confirm-change-password", {
        oldPassword: passwords.old,
        newPassword: passwords.new1,
        otp: otp,
      });
      toast.success("Đổi mật khẩu thành công!");
      setPasswords({ old: "", new1: "", new2: "" });
      setShowPasswordForm(false);
      setStep(1);
    } catch {
      toast.error("Đổi mật khẩu thất bại!");
    }
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: '#1976d2' }}>
        ⚙️ Thông tin tài khoản
      </Typography>

      {/* Profile Information */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Thông tin cơ bản</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography><strong>Tên đăng nhập:</strong> {profile.username}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography><strong>Loại tài khoản:</strong> {profile.userType}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography><strong>Ngày tạo:</strong> {new Date(profile.createdAt).toLocaleDateString("vi-VN")}</Typography>
          </Grid>
        </Grid>
      </Box>

      {/* Action Buttons */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Button
          variant="contained"
          onClick={() => {
            setIsEditing(prev => {
              if (!prev) setShowPasswordForm(false);
              return !prev;
            });
            setForm(profile);
          }}
          startIcon={<span>✏️</span>}
        >
          {isEditing ? 'Hủy chỉnh sửa' : 'Chỉnh sửa thông tin'}
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            setIsEditing(false);
            setShowPasswordForm(true);
            requestOtp();
          }}
          startIcon={<span>🔒</span>}
        >
          Đổi mật khẩu
        </Button>
      </Box>

      {/* Edit Form */}
      {isEditing && (
        <Box component="form" onSubmit={handleProfileUpdate} sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 3, color: '#1976d2' }}>
            ✏️ Chỉnh sửa thông tin cá nhân
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Tên hiển thị"
                name="displayName"
                value={form.displayName || ""}
                onChange={e => setForm({ ...form, displayName: e.target.value })}
                fullWidth
                margin="normal"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover': {
                      boxShadow: '0 4px 12px rgba(25, 118, 210, 0.15)',
                    }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                name="email"
                type="email"
                value={form.email || ""}
                onChange={e => setForm({ ...form, email: e.target.value })}
                fullWidth
                margin="normal"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover': {
                      boxShadow: '0 4px 12px rgba(25, 118, 210, 0.15)',
                    }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Số điện thoại"
                name="phoneNumber"
                value={form.phoneNumber || ""}
                onChange={e => setForm({ ...form, phoneNumber: e.target.value })}
                fullWidth
                margin="normal"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover': {
                      boxShadow: '0 4px 12px rgba(25, 118, 210, 0.15)',
                    }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Địa chỉ"
                name="address"
                value={form.address || ""}
                onChange={e => setForm({ ...form, address: e.target.value })}
                fullWidth
                margin="normal"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover': {
                      boxShadow: '0 4px 12px rgba(25, 118, 210, 0.15)',
                    }
                  }
                }}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              sx={{
                background: 'linear-gradient(45deg, #4caf50, #66bb6a)',
                borderRadius: '25px',
                padding: '12px 32px',
                fontWeight: 600,
                textTransform: 'none',
                minWidth: '120px',
                boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #43a047, #4caf50)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(76, 175, 80, 0.4)',
                }
              }}
            >
              💾 Lưu thay đổi
            </Button>
            <Button
              variant="outlined"
              onClick={() => setIsEditing(false)}
              sx={{
                borderRadius: '25px',
                padding: '12px 32px',
                fontWeight: 600,
                textTransform: 'none',
                minWidth: '120px',
                borderColor: '#f44336',
                color: '#f44336',
                '&:hover': {
                  backgroundColor: '#f44336',
                  color: 'white',
                  transform: 'translateY(-2px)',
                }
              }}
            >
              ❌ Hủy
            </Button>
          </Box>
        </Box>
      )}

      {/* Password Change Form */}
      {showPasswordForm && step === 2 && (
        <Box component="form" onSubmit={handleChangePasswordWithOtp}>
          <Typography variant="h6" sx={{ mb: 2, color: '#ff9800', fontWeight: 'bold' }}>
            🔐 Đổi mật khẩu
          </Typography>
          <Typography sx={{ mb: 2, color: '#666' }}>
            Nhập mã OTP đã gửi về email và mật khẩu mới:
          </Typography>
          
          <TextField
            label="Mã OTP"
            value={otp}
            onChange={e => setOtp(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
            placeholder="Nhập mã OTP từ email"
          />
          <TextField
            label="Mật khẩu cũ"
            type="password"
            value={passwords.old}
            onChange={e => setPasswords({ ...passwords, old: e.target.value })}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Mật khẩu mới"
            type="password"
            value={passwords.new1}
            onChange={e => setPasswords({ ...passwords, new1: e.target.value })}
            fullWidth
            sx={{ mb: 2 }}
            helperText="Mật khẩu phải có ít nhất 6 ký tự"
          />
          <TextField
            label="Nhập lại mật khẩu mới"
            type="password"
            value={passwords.new2}
            onChange={e => setPasswords({ ...passwords, new2: e.target.value })}
            fullWidth
            sx={{ mb: 3 }}
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              sx={{
                background: 'linear-gradient(45deg, #ff9800, #ffb74d)',
                borderRadius: '25px',
                padding: '12px 32px',
                fontWeight: 600,
                textTransform: 'none',
                minWidth: '120px',
                boxShadow: '0 4px 15px rgba(255, 152, 0, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #f57c00, #ff9800)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(255, 152, 0, 0.4)',
                }
              }}
            >
              🔄 Đổi mật khẩu
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                setShowPasswordForm(false);
                setStep(1);
              }}
              sx={{
                borderRadius: '25px',
                padding: '12px 32px',
                fontWeight: 600,
                textTransform: 'none',
                minWidth: '120px',
                borderColor: '#f44336',
                color: '#f44336',
                '&:hover': {
                  backgroundColor: '#f44336',
                  color: 'white',
                  transform: 'translateY(-2px)',
                }
              }}
            >
              ❌ Hủy
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
}
