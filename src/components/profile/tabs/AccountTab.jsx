
import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent
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
  const [badges, setBadges] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch membership history and badges data
  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const res = await api.get("/Badge/My-Badge");
        const data = res.data;
        if (Array.isArray(data)) {
          setBadges(data);
        } else if (data?.iconUrl) {
          setBadges([data]);
        }
      } catch (error) {
        console.error("Error fetching badges:", error);
        toast.error("Không lấy được huy hiệu!");
      }
    };

    const fetchMembershipHistory = async () => {
      try {
        const res = await api.get("/UserMemberShipHistory/my-history");
        setHistory(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Error fetching membership history:", error);
        toast.error("Không lấy được lịch sử gói thành viên!");
      }
    };

    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchBadges(), fetchMembershipHistory()]);
      setLoading(false);
    };

    fetchData();
  }, []);

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

      {/* Membership History Section */}
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" sx={{ mb: 3, color: '#2196f3', display: 'flex', alignItems: 'center', gap: 1 }}>
          <span style={{ fontSize: '1.5rem' }}>📅</span>
          Lịch sử gói thành viên
        </Typography>
        
        {history.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
            <Typography variant="body1" color="textSecondary" sx={{ mb: 1 }}>
              📋 Chưa có lịch sử gói thành viên
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Hãy đăng ký gói thành viên để bắt đầu hành trình cai thuốc!
            </Typography>
          </Box>
        ) : (
          <Box sx={{ maxHeight: '400px', overflowY: 'auto' }}>
            {history.map((item, idx) => (
              <Card 
                key={idx} 
                sx={{ 
                  mb: 2, 
                  border: '1px solid #e3f2fd',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(33, 150, 243, 0.15)',
                  }
                }}
              >
                <CardContent>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={4}>
                      <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 'bold' }}>
                        {item.planName}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="body2" color="textSecondary">
                        Ngày bắt đầu
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {new Date(item.startDate).toLocaleDateString("vi-VN")}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="body2" color="textSecondary">
                        Ngày kết thúc
                      </Typography>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          fontWeight: 600,
                          color: item.endDate ? '#333' : '#4caf50'
                        }}
                      >
                        {item.endDate ? new Date(item.endDate).toLocaleDateString("vi-VN") : "Hiện tại"}
                      </Typography>
                      {!item.endDate && (
                        <Typography variant="caption" sx={{ color: '#4caf50', fontWeight: 'bold' }}>
                          • Đang hoạt động
                        </Typography>
                      )}
                    </Grid>
                  </Grid>
                  
                  {item.status && (
                    <Box sx={{ mt: 2 }}>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          display: 'inline-block',
                          px: 2, 
                          py: 0.5, 
                          borderRadius: '12px', 
                          backgroundColor: item.status === 'Active' ? '#e8f5e8' : '#f5f5f5',
                          color: item.status === 'Active' ? '#2e7d32' : '#666',
                          fontWeight: 600
                        }}
                      >
                        {item.status}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Paper>

      {/* Achievement Statistics */}
      <Paper sx={{ p: 3, mt: 3, backgroundColor: '#fff3e0', border: '1px solid #ffcc02' }}>
        <Typography variant="h6" sx={{ mb: 2, color: '#f57c00' }}>
          📊 Thống kê thành tích
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Box sx={{ textAlign: 'center', p: 2, backgroundColor: 'white', borderRadius: 2 }}>
              <Typography variant="h4" sx={{ color: '#ff9800', fontWeight: 'bold' }}>
                {badges.length}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Huy hiệu đã đạt được
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box sx={{ textAlign: 'center', p: 2, backgroundColor: 'white', borderRadius: 2 }}>
              <Typography variant="h4" sx={{ color: '#2196f3', fontWeight: 'bold' }}>
                {history.length}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Gói thành viên đã sử dụng
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}