import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Card,
  CardContent,
  Grid
} from "@mui/material";
import { toast } from "react-toastify";
import api from "../../../api/axios";

export default function CoachAccountTab({ profile, setProfile }) {
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
      <Paper sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ color: '#666' }}>📋 Thông tin cơ bản</Typography>
          {!isEditing && !showPasswordForm && (
            <Button
              variant="contained"
              onClick={() => {
                setIsEditing(true);
                setForm(profile);
              }}
              startIcon={<span>✏️</span>}
            >
              Chỉnh sửa thông tin
            </Button>
          )}
        </Box>

        {!isEditing ? (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Card sx={{ bgcolor: '#f8f9fa', border: '1px solid #e0e0e0' }}>
                <CardContent>
                  <Typography variant="body2" color="textSecondary">Tên đăng nhập</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>{profile.username}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card sx={{ bgcolor: '#f8f9fa', border: '1px solid #e0e0e0' }}>
                <CardContent>
                  <Typography variant="body2" color="textSecondary">Tên hiển thị</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>{profile.displayName || 'Chưa cập nhật'}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card sx={{ bgcolor: '#f8f9fa', border: '1px solid #e0e0e0' }}>
                <CardContent>
                  <Typography variant="body2" color="textSecondary">Email</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>{profile.email}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card sx={{ bgcolor: '#f8f9fa', border: '1px solid #e0e0e0' }}>
                <CardContent>
                  <Typography variant="body2" color="textSecondary">Loại tài khoản</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#2e7d32' }}>{profile.userType}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card sx={{ bgcolor: '#f8f9fa', border: '1px solid #e0e0e0' }}>
                <CardContent>
                  <Typography variant="body2" color="textSecondary">Số điện thoại</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>{profile.phoneNumber || 'Chưa cập nhật'}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card sx={{ bgcolor: '#f8f9fa', border: '1px solid #e0e0e0' }}>
                <CardContent>
                  <Typography variant="body2" color="textSecondary">Địa chỉ</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>{profile.address || 'Chưa cập nhật'}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card sx={{ bgcolor: '#f8f9fa', border: '1px solid #e0e0e0' }}>
                <CardContent>
                  <Typography variant="body2" color="textSecondary">Ngày tạo tài khoản</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {new Date(profile.createdAt).toLocaleDateString("vi-VN")}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        ) : (
          /* Edit Form */
          <Box component="form" onSubmit={handleProfileUpdate}>
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
                  minWidth: '120px'
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
                  color: '#f44336'
                }}
              >
                ❌ Hủy
              </Button>
            </Box>
          </Box>
        )}
      </Paper>

      {/* Password Change Section */}
      <Paper sx={{ p: 3, border: '2px solid #ff9800' }}>
        <Typography variant="h6" sx={{ mb: 2, color: '#ff9800', fontWeight: 'bold' }}>
          🔐 Đổi mật khẩu
        </Typography>
        
        {!showPasswordForm && !isEditing ? (
          <Box>
            <Typography sx={{ mb: 3, color: '#666' }}>
              Để bảo mật tài khoản, hãy thay đổi mật khẩu định kỳ.
            </Typography>
            <Button
              variant="contained"
              onClick={() => {
                setShowPasswordForm(true);
                requestOtp();
              }}
              startIcon={<span>🔒</span>}
              sx={{
                background: 'linear-gradient(45deg, #ff9800, #ffb74d)',
                borderRadius: '25px',
                padding: '12px 32px',
                fontWeight: 600,
                textTransform: 'none',
                minWidth: '160px'
              }}
            >
              Đổi mật khẩu
            </Button>
          </Box>
        ) : null}

        {/* Password Change Form */}
        {showPasswordForm && step === 2 && (
          <Box component="form" onSubmit={handleChangePasswordWithOtp}>
            <Typography sx={{ mb: 3, color: '#666', fontStyle: 'italic' }}>
              📧 Mã OTP đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư.
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Mã OTP"
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  fullWidth
                  placeholder="Nhập mã OTP từ email"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover': {
                        boxShadow: '0 4px 12px rgba(255, 152, 0, 0.15)',
                      }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Mật khẩu cũ"
                  type="password"
                  value={passwords.old}
                  onChange={e => setPasswords({ ...passwords, old: e.target.value })}
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover': {
                        boxShadow: '0 4px 12px rgba(255, 152, 0, 0.15)',
                      }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Mật khẩu mới"
                  type="password"
                  value={passwords.new1}
                  onChange={e => setPasswords({ ...passwords, new1: e.target.value })}
                  fullWidth
                  helperText="Mật khẩu phải có ít nhất 6 ký tự"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover': {
                        boxShadow: '0 4px 12px rgba(255, 152, 0, 0.15)',
                      }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Nhập lại mật khẩu mới"
                  type="password"
                  value={passwords.new2}
                  onChange={e => setPasswords({ ...passwords, new2: e.target.value })}
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover': {
                        boxShadow: '0 4px 12px rgba(255, 152, 0, 0.15)',
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
                  background: 'linear-gradient(45deg, #ff9800, #ffb74d)',
                  borderRadius: '25px',
                  padding: '12px 32px',
                  fontWeight: 600,
                  textTransform: 'none',
                  minWidth: '140px',
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
                  setPasswords({ old: "", new1: "", new2: "" });
                  setOtp("");
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
      </Paper>
    </Box>
  );
}
