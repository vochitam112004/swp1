import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import {
  TextField, Button, Avatar, Typography, Box, Paper
} from "@mui/material";
import { toast } from "react-toastify";
import { useAuth } from "../auth/AuthContext";
import { TriggerFactorService } from "../../api/triggerFactorService";
import ApiHelper from "../../utils/apiHelper";
import "../../css/Profile.css";
import "../../css/SmokingHabits.css";
import { baseApiUrl } from "../../api/axios";

export default function Profile() {
  const { user } = useAuth();
  const [data, setData] = useState({
    cigarettesSmoked: 0,
    experienceLevel: 0,
    pricePerPack: 0,
    cigarettesPerPack: 0,
  });
  const [profile, setProfile] = useState(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState(null);
  const [history, setHistory] = useState([]);
  const [badges, setBadges] = useState([]);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [passwords, setPasswords] = useState({ old: "", new1: "", new2: "" });
  const [triggerFactors, setTriggerFactors] = useState([]);

  useEffect(() => {
    api.get("/User")
      .then(res => {
        const u = res.data;
        const mapped = {
          username: u.userName,
          displayName: u.displayName,
          avatarUrl: u.avatarUrl,
          email: u.email,
          phoneNumber: u.phoneNumber,
          address: u.address,
          userType: u.userType,
          createdAt: u.createdAt,
          isActive: u.isActive,
        };
        setProfile(mapped);
        setForm(mapped);
      })
      .catch(() => toast.error("Không lấy được profile!"));
  }, []);

  useEffect(() => {
    ApiHelper.fetchMyTriggerFactors()
      .then((triggers) => {
        const names = triggers.map((trigger) => trigger.name);
        setTriggerFactors(names);
      })
      .catch((err) => {
        console.error("Failed to fetch trigger factors", err);
        toast.error(err.message || "Không thể tải yếu tố kích thích");
      });
  }, []);


  useEffect(() => {
    api.get("/api/MemberProfile/GetMyMemberProfile")
      .then((res) => {
        const {
          cigarettesSmoked,
          experienceLevel,
          pricePerPack,
          cigarettesPerPack,
          health,
          quitAttempts,
          personalMotivation,
        } = res.data;

        setData({
          cigarettesSmoked,
          experienceLevel,
          pricePerPack,
          cigarettesPerPack,
          health,
          quitAttempts,
          personalMotivation,
        });
      })
      .catch((err) => {
        console.error("Lỗi khi lấy dữ liệu hồ sơ hút thuốc:", err);
      });
  }, []);

  useEffect(() => {
    if (!user || user.userType !== "Member") return;

    api.get("/UserMemberShipHistory/my-history")
      .then(res => setHistory(Array.isArray(res.data) ? res.data : []))
      .catch(() => toast.error("Không lấy được lịch sử gói thành viên!"));

    api.get("/Badge/get-my-badges")
      .then((res) => {
        const data = res.data?.badges || [];
        setBadges(data);
      })
      .catch(() => toast.error("Không lấy được huy hiệu!"));
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("UserName", form.username || "");
    formData.append("DisplayName", form.displayName || "");
    formData.append("Email", form.email || "");
    formData.append("PhoneNumber", form.phoneNumber || "");
    formData.append("Address", form.address || "");
    formData.append("IsActive", form.isActive ?? true); // boolean

    // Add smoking habits data for members
    if (user?.userType === "Member") {
      const smokingHabitsData = {
        dailyCigarettes: parseInt(form.dailyCigarettes) || 0,
        yearsOfSmoking: parseInt(form.yearsOfSmoking) || 0,
        packPrice: parseInt(form.packPrice) || 25000,
        cigarettesPerPack: parseInt(form.cigarettesPerPack) || 20,
        preferredBrand: form.preferredBrand || "",
        smokingTriggers: form.smokingTriggers || "",
        healthConditions: form.healthConditions || "",
        allergies: form.allergies || "",
        medications: form.medications || "",
      };

      Object.assign(body, smokingHabitsData);
    }

    try {
      await api.put("/User/My-Update", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Cập nhật thông tin thành công!");
      setProfile({ ...profile, ...form });
      setEdit(false);
    } catch (err) {
      console.log(err)
      toast.error("Cập nhật thất bại!");
    }
  };


  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file ảnh!");
      return;
    }

    const formData = new FormData();
    formData.append("UserName", profile.username);
    formData.append("DisplayName", profile.displayName);
    formData.append("Email", profile.email);
    formData.append("PhoneNumber", profile.phoneNumber || "");
    formData.append("Address", profile.address || "");
    formData.append("IsActive", profile.isActive ?? true);
    formData.append("AvatarFile", file); // ✅ tên đúng

    try {
      const res = await api.put("/User/My-Update", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const imageUrl = res.data.avatarUrl || profile.avatarUrl;
      setProfile({ ...profile, avatarUrl: imageUrl });
      setForm(f => ({ ...f, avatarUrl: imageUrl }));
      toast.success("Cập nhật ảnh đại diện thành công!");
    } catch {
      toast.error("Cập nhật ảnh đại diện thất bại!");
    }
  };


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

  if (!profile || !form) return <div>Đang tải...</div>;

  return (
    <Box className="profile-container">
      <Paper className="profile-paper" elevation={6}>
        <Box className="profile-avatar-container">
          <Avatar
            src={
              profile.avatarUrl
                ? `${baseApiUrl}${profile.avatarUrl}`
                : `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.displayName || profile.username)}`
            }
          />
          <label>
            <input type="file" accept="image/*" hidden onChange={handleAvatarChange} />
            <Button variant="outlined" component="span" size="medium">
              Đổi ảnh
            </Button>
          </label>
        </Box>

        <Typography className="profile-name">{profile.displayName}</Typography>
        <Typography className="profile-info"><strong>Email:</strong> {profile.email}</Typography>
        <Typography className="profile-info"><strong>Tên đăng nhập:</strong> {profile.username}</Typography>
        <Typography className="profile-info"><strong>Loại người dùng:</strong> {profile.userType}</Typography>
        <Typography className="profile-info"><strong>SĐT:</strong> {profile.phoneNumber || "Chưa cập nhật"}</Typography>
        <Typography className="profile-info"><strong>Địa chỉ:</strong> {profile.address || "Chưa cập nhật"}</Typography>

        {/* Smoking Habits Information for Members */}
        {user?.userType === "Member" && (
          <Box sx={{
            mt: 3,
            p: 3,
            background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.05) 0%, rgba(30, 136, 229, 0.1) 100%)',
            borderRadius: 3,
            border: '1px solid rgba(33, 150, 243, 0.2)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <Box sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: 'linear-gradient(90deg, #2196f3, #03a9f4, #2196f3)',
            }} />

            <Typography variant="h6" sx={{
              color: '#1976d2',
              fontWeight: 'bold',
              mb: 3,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <span style={{ fontSize: '1.5rem' }}>🚬</span>
              Thông tin hút thuốc
            </Typography>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mb: 2 }}>
              <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 2, border: '1px solid #e3f2fd' }}>
                <Typography sx={{ color: '#1976d2', fontWeight: 600, fontSize: '0.9rem', mb: 0.5 }}>
                  ĐIẾU THUỐC MỖI NGÀY
                </Typography>
                <Typography variant="h6" sx={{ color: '#333', fontWeight: 'bold' }}>
                  {data.cigarettesSmoked || 0} <span style={{ fontSize: '0.8rem', color: '#666' }}>điếu</span>
                </Typography>
              </Box>

              <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 2, border: '1px solid #e3f2fd' }}>
                <Typography sx={{ color: '#1976d2', fontWeight: 600, fontSize: '0.9rem', mb: 0.5 }}>
                  SỐ NĂM HÚT THUỐC
                </Typography>
                <Typography variant="h6" sx={{ color: '#333', fontWeight: 'bold' }}>
                  {data.experienceLevel || 0} <span style={{ fontSize: '0.8rem', color: '#666' }}>năm</span>
                </Typography>
              </Box>

              <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 2, border: '1px solid #e3f2fd' }}>
                <Typography sx={{ color: '#1976d2', fontWeight: 600, fontSize: '0.9rem', mb: 0.5 }}>
                  GIÁ 1 GÓI THUỐC
                </Typography>
                <Typography variant="h6" sx={{ color: '#333', fontWeight: 'bold' }}>
                  {data.pricePerPack.toLocaleString()} <span style={{ fontSize: '0.8rem', color: '#666' }}>VND</span>
                </Typography>
              </Box>

              <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 2, border: '1px solid #e3f2fd' }}>
                <Typography sx={{ color: '#1976d2', fontWeight: 600, fontSize: '0.9rem', mb: 0.5 }}>
                  ĐIẾU TRONG 1 GÓI
                </Typography>
                <Typography variant="h6" sx={{ color: '#333', fontWeight: 'bold' }}>
                  {data.cigarettesPerPack} <span style={{ fontSize: '0.8rem', color: '#666' }}>điếu</span>
                </Typography>
              </Box>
            </Box>

            {triggerFactors >= 0 && (
              <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 2, border: '1px solid #e3f2fd', mb: 2 }}>
                <Typography sx={{ color: '#1976d2', fontWeight: 600, fontSize: '0.9rem', mb: 0.5 }}>
                  YẾU TỐ KÍCH THÍCH
                </Typography>
                <Typography sx={{ color: '#333', fontWeight: 500 }}>
                  {triggerFactors.map((name, index) => (
                    <li key={index} style={{ color: '#333', fontWeight: 500 }}>
                      {name}
                    </li>
                  ))}
                </Typography>
              </Box>
            )}

            {/* Health Information */}
            {data && (
              <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(76, 175, 80, 0.05)', borderRadius: 2, border: '1px solid rgba(76, 175, 80, 0.2)' }}>
                <Typography variant="subtitle2" sx={{
                  color: '#4caf50',
                  fontWeight: 'bold',
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <span style={{ fontSize: '1.2rem' }}>💚</span>
                  Thông tin sức khỏe
                </Typography>

                <Box sx={{ display: 'grid', gap: 2 }}>
                  <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 1, border: '1px solid #e8f5e8' }}>
                    <Typography sx={{ color: '#4caf50', fontWeight: 600, fontSize: '0.85rem', mb: 0.5 }}>
                      TÌNH TRẠNG SỨC KHỎE
                    </Typography>
                    <Typography sx={{ fontSize: '0.9rem', color: '#333' }}>
                      {data.health}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )}
            {data && (
              <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 1, border: '1px solid #e8f5e8' }}>
                <Typography sx={{ color: '#4caf50', fontWeight: 600, fontSize: '0.85rem', mb: 0.5 }}>
                  Số lần thử cai thuốc
                </Typography>
                <Typography sx={{ fontSize: '0.9rem', color: '#333' }}>
                  {data.quitAttempts}
                </Typography>
              </Box>
            )}
            {data && (
              <Box sx={{ p: 2, bgcolor: 'white', borderRadius: 1, border: '1px solid #e8f5e8' }}>
                <Typography sx={{ color: '#4caf50', fontWeight: 600, fontSize: '0.85rem', mb: 0.5 }}>
                  Động lực cá nhân
                </Typography>
                <Typography sx={{ fontSize: '0.9rem', color: '#333' }}>
                  {data.personalMotivation}
                </Typography>
              </Box>
            )}

            {/* Cost Calculation */}
            {/* {data.dailyCigarettes > 0 && profile.packPrice > 0 && (
              <Box sx={{
                mt: 3,
                p: 3,
                background: 'linear-gradient(135deg, #fff3cd, #ffeaa7)',
                borderRadius: 2,
                border: '2px solid #ffd54f',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <Box sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '3px',
                  background: 'linear-gradient(90deg, #ff9800, #ffc107, #ff9800)',
                }} />

                <Typography variant="h6" sx={{
                  color: '#e65100',
                  fontWeight: 'bold',
                  mb: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 1
                }}>
                  <span style={{ fontSize: '1.5rem' }}>💰</span>
                  Chi phí ước tính hàng tháng
                </Typography>
                <Typography variant="h4" sx={{
                  color: '#d32f2f',
                  fontWeight: 'bold',
                  textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                  {Math.round((profile.dailyCigarettes / (profile.cigarettesPerPack || 20)) * (profile.packPrice || 25000) * 30).toLocaleString('vi-VN')} VND
                </Typography>
                <Typography variant="body2" sx={{ color: '#bf360c', mt: 1, fontStyle: 'italic' }}>
                  *Tính dựa trên thói quen hút thuốc hiện tại
                </Typography>
              </Box>
            )} */}
          </Box>
        )}

        <Typography className="profile-createdAt">
          Ngày tạo: {new Date(profile.createdAt).toLocaleDateString("vi-VN")}
        </Typography>

        <Box className="buttons-group">
          <Button
            variant="contained"
            onClick={() => {
              setEdit(prev => {
                if (!prev) setShowPasswordForm(false);
                return !prev;
              });
            }}
            startIcon={<span>✏️</span>}
          >
            {edit ? 'Hủy chỉnh sửa' : 'Chỉnh sửa thông tin'}
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              setEdit(false);
              setShowPasswordForm(true);
              requestOtp();
            }}
            startIcon={<span>🔒</span>}
          >
            Đổi mật khẩu
          </Button>
        </Box>

        {edit && (
          <form onSubmit={handleProfileUpdate} className="edit-form" style={{ marginTop: 24 }}>
            <Typography variant="h6" sx={{
              mb: 3,
              color: '#1976d2',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <span style={{ fontSize: '1.5rem' }}>✏️</span>
              Chỉnh sửa thông tin cá nhân
            </Typography>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mb: 2 }}>
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
            </Box>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mb: 2 }}>
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
            </Box>

            {/* Smoking Habits Fields for Members */}
            {user?.userType === "Member" && (
              <Box sx={{
                mt: 3,
                p: 3,
                background: 'linear-gradient(135deg, rgba(33, 150, 243, 0.05) 0%, rgba(30, 136, 229, 0.1) 100%)',
                borderRadius: 3,
                border: '1px solid rgba(33, 150, 243, 0.2)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <Box sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '3px',
                  background: 'linear-gradient(90deg, #2196f3, #03a9f4, #2196f3)',
                }} />

                <Typography variant="h6" sx={{
                  color: '#1976d2',
                  fontWeight: 'bold',
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <span style={{ fontSize: '1.5rem' }}>🚬</span>
                  Thông tin hút thuốc
                </Typography>

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mb: 2 }}>
                  <TextField
                    label="Số điếu thuốc mỗi ngày"
                    name="dailyCigarettes"
                    type="number"
                    value={form.dailyCigarettes || ""}
                    onChange={e => setForm({ ...form, dailyCigarettes: e.target.value })}
                    inputProps={{ min: 0, max: 100 }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'white',
                        borderRadius: 2,
                        '&:hover': {
                          boxShadow: '0 4px 12px rgba(33, 150, 243, 0.15)',
                        }
                      }
                    }}
                  />
                  <TextField
                    label="Số năm hút thuốc"
                    name="yearsOfSmoking"
                    type="number"
                    value={form.yearsOfSmoking || ""}
                    onChange={e => setForm({ ...form, yearsOfSmoking: e.target.value })}
                    inputProps={{ min: 0, max: 100 }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'white',
                        borderRadius: 2,
                        '&:hover': {
                          boxShadow: '0 4px 12px rgba(33, 150, 243, 0.15)',
                        }
                      }
                    }}
                  />
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mb: 2 }}>
                  <TextField
                    label="Giá 1 gói thuốc (VND)"
                    name="packPrice"
                    type="number"
                    value={form.packPrice || ""}
                    onChange={e => setForm({ ...form, packPrice: e.target.value })}
                    inputProps={{ min: 1000, step: 1000 }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'white',
                        borderRadius: 2,
                        '&:hover': {
                          boxShadow: '0 4px 12px rgba(33, 150, 243, 0.15)',
                        }
                      }
                    }}
                  />
                  <TextField
                    label="Số điếu trong 1 gói"
                    name="cigarettesPerPack"
                    type="number"
                    value={form.cigarettesPerPack || ""}
                    onChange={e => setForm({ ...form, cigarettesPerPack: e.target.value })}
                    inputProps={{ min: 1, max: 50 }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'white',
                        borderRadius: 2,
                        '&:hover': {
                          boxShadow: '0 4px 12px rgba(33, 150, 243, 0.15)',
                        }
                      }
                    }}
                  />
                </Box>

                <TextField
                  label="Thương hiệu thuốc ưa thích"
                  name="preferredBrand"
                  value={form.preferredBrand || ""}
                  onChange={e => setForm({ ...form, preferredBrand: e.target.value })}
                  fullWidth
                  margin="normal"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'white',
                      borderRadius: 2,
                      '&:hover': {
                        boxShadow: '0 4px 12px rgba(33, 150, 243, 0.15)',
                      }
                    }
                  }}
                />

                <TextField
                  label="Tình huống kích thích hút thuốc"
                  name="smokingTriggers"
                  value={form.smokingTriggers || ""}
                  onChange={e => setForm({ ...form, smokingTriggers: e.target.value })}
                  fullWidth
                  multiline
                  rows={2}
                  margin="normal"
                  placeholder="Ví dụ: căng thẳng, uống cà phê, gặp bạn bè..."
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'white',
                      borderRadius: 2,
                      '&:hover': {
                        boxShadow: '0 4px 12px rgba(33, 150, 243, 0.15)',
                      }
                    }
                  }}
                />

                {/* Health Information */}
                <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(76, 175, 80, 0.05)', borderRadius: 2, border: '1px solid rgba(76, 175, 80, 0.2)' }}>
                  <Typography variant="subtitle1" sx={{
                    color: '#4caf50',
                    fontWeight: 'bold',
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    <span style={{ fontSize: '1.2rem' }}>💚</span>
                    Thông tin sức khỏe
                  </Typography>

                  <TextField
                    label="Tình trạng sức khỏe"
                    name="healthConditions"
                    value={form.healthConditions || ""}
                    onChange={e => setForm({ ...form, healthConditions: e.target.value })}
                    fullWidth
                    multiline
                    rows={2}
                    margin="normal"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: 'white',
                        borderRadius: 2,
                        '&:hover': {
                          boxShadow: '0 4px 12px rgba(76, 175, 80, 0.15)',
                        }
                      }
                    }}
                  />

                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
                    <TextField
                      label="Dị ứng"
                      name="allergies"
                      value={form.allergies || ""}
                      onChange={e => setForm({ ...form, allergies: e.target.value })}
                      margin="normal"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: 'white',
                          borderRadius: 2,
                          '&:hover': {
                            boxShadow: '0 4px 12px rgba(76, 175, 80, 0.15)',
                          }
                        }
                      }}
                    />
                    <TextField
                      label="Thuốc đang sử dụng"
                      name="medications"
                      value={form.medications || ""}
                      onChange={e => setForm({ ...form, medications: e.target.value })}
                      margin="normal"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: 'white',
                          borderRadius: 2,
                          '&:hover': {
                            boxShadow: '0 4px 12px rgba(76, 175, 80, 0.15)',
                          }
                        }
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            )}

            <Box sx={{ mt: 2 }}>
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
                onClick={() => setEdit(false)}
                sx={{
                  ml: 2,
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
          </form>
        )}

        {showPasswordForm && step === 2 && (
          <Box component="form" onSubmit={handleChangePasswordWithOtp} className="password-form">
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
              sx={{ mt: 2 }}
              placeholder="Nhập mã OTP từ email"
            />
            <TextField
              label="Mật khẩu cũ"
              type="password"
              value={passwords.old}
              onChange={e => setPasswords({ ...passwords, old: e.target.value })}
              fullWidth
              sx={{ mt: 2 }}
            />
            <TextField
              label="Mật khẩu mới"
              type="password"
              value={passwords.new1}
              onChange={e => setPasswords({ ...passwords, new1: e.target.value })}
              fullWidth
              sx={{ mt: 2 }}
              helperText="Mật khẩu phải có ít nhất 6 ký tự"
            />
            <TextField
              label="Nhập lại mật khẩu mới"
              type="password"
              value={passwords.new2}
              onChange={e => setPasswords({ ...passwords, new2: e.target.value })}
              fullWidth
              sx={{ mt: 2 }}
            />
            <Box className="password-form-buttons">
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

        {user?.userType === "Member" && (
          <Box sx={{ mt: 6 }}>
            <Typography className="membership-history-title">Huy hiệu của bạn</Typography>
            {badges.length === 0 ? (
              <Typography className="membership-history-empty">Chưa có huy hiệu nào.</Typography>
            ) : (
              <Box className="badges-container">
                <Box className="badges-grid">
                  {badges.map((b, idx) => (
                    <Box key={b.badgeId || idx} className="badge-item">
                      <img
                        src={
                          b.iconUrl?.startsWith("http")
                            ? b.iconUrl
                            : `${baseApiUrl}${b.iconUrl}`
                        }
                        alt={b.name}
                        width={60}
                        height={60}
                      />
                      <Typography variant="body2" fontWeight={600}>{b.name}</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        )}

        {user?.userType === "Member" && (
          <Box className="membership-history" sx={{ mt: 6 }}>
            <Typography className="membership-history-title">Lịch sử gói thành viên</Typography>
            {history.length === 0 ? (
              <Typography className="membership-history-empty">Chưa có lịch sử.</Typography>
            ) : (
              <ul className="membership-history-list">
                {history.map((h, idx) => (
                  <li key={idx}>
                    {h.planName} ({new Date(h.startDate).toLocaleDateString("vi-VN")} - {h.endDate ? new Date(h.endDate).toLocaleDateString("vi-VN") : "Hiện tại"})
                  </li>
                ))}
              </ul>
            )}
          </Box>
        )}
      </Paper>
    </Box>
  );
}