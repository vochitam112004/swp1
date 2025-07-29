import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import {
  TextField, Button, Avatar, Typography, Box, Paper
} from "@mui/material";
import { toast } from "react-toastify";
import { useAuth } from "../auth/AuthContext";
import "../../css/Profile.css";
import { baseApiUrl } from "../../api/axios";

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState(null);
  const [history, setHistory] = useState([]);
  const [badges, setBadges] = useState([]);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [passwords, setPasswords] = useState({ old: "", new1: "", new2: "" });

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
    if (!user || user.userType !== "Member") return;

    api.get("/UserMemberShipHistory/my-history")
      .then(res => setHistory(Array.isArray(res.data) ? res.data : []))
      .catch(() => toast.error("Không lấy được lịch sử gói thành viên!"));

    api.get("/Badge/My-Badge")
      .then((res) => {
        const data = res.data;
        if (Array.isArray(data)) {
          setBadges(data);
        } else if (data?.iconUrl) {
          setBadges([data]);
        }
      })
      .catch(() => toast.error("Không lấy được huy hiệu!"));
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    const body = {
      userName: form.username,
      displayName: form.displayName,
      avatarUrl: form.avatarUrl,
      email: form.email,
      phoneNumber: form.phoneNumber,
      address: form.address,
      isActive: form.isActive ?? true,
    };

    try {
      await api.put("/User/My-Update", body);
      toast.success("Cập nhật thông tin thành công!");
      setProfile({ ...profile, ...form });
      setEdit(false);
    } catch {
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
    formData.append("avatar", file);

    try {
      const res = await api.put("/User/My-Update", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const imageUrl = res.data.avatarUrl || form.avatarUrl;
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
    } catch {
      toast.error("Gửi OTP thất bại!");
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
              profile.avatarUrl ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.displayName || profile.username)}`
            }
            className="profile-avatar"
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
          >
            Chỉnh sửa thông tin
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              setEdit(false);
              setShowPasswordForm(true);
              requestOtp();
            }}
          >
            Đổi mật khẩu
          </Button>
        </Box>

        {edit && (
          <form onSubmit={handleProfileUpdate} className="edit-form" style={{ marginTop: 24 }}>
            <TextField
              label="Tên hiển thị"
              name="displayName"
              value={form.displayName || ""}
              onChange={e => setForm({ ...form, displayName: e.target.value })}
              fullWidth
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              value={form.email || ""}
              onChange={e => setForm({ ...form, email: e.target.value })}
              fullWidth
            />
            <TextField
              label="Số điện thoại"
              name="phoneNumber"
              value={form.phoneNumber || ""}
              onChange={e => setForm({ ...form, phoneNumber: e.target.value })}
              fullWidth
            />
            <TextField
              label="Địa chỉ"
              name="address"
              value={form.address || ""}
              onChange={e => setForm({ ...form, address: e.target.value })}
              fullWidth
            />
            <Box sx={{ mt: 2 }}>
              <Button type="submit" variant="contained">Lưu</Button>
              <Button variant="outlined" onClick={() => setEdit(false)} sx={{ ml: 2 }}>Hủy</Button>
            </Box>
          </form>
        )}

        {showPasswordForm && step === 2 && (
          <Box component="form" onSubmit={handleChangePasswordWithOtp} sx={{ mt: 4 }}>
            <Typography>Nhập mã OTP đã gửi về email và mật khẩu mới:</Typography>
            <TextField
              label="Mã OTP"
              value={otp}
              onChange={e => setOtp(e.target.value)}
              fullWidth
              sx={{ mt: 2 }}
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
            />
            <TextField
              label="Nhập lại mật khẩu mới"
              type="password"
              value={passwords.new2}
              onChange={e => setPasswords({ ...passwords, new2: e.target.value })}
              fullWidth
              sx={{ mt: 2 }}
            />
            <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
              <Button type="submit" variant="contained">Lưu thay đổi</Button>
              <Button variant="outlined" onClick={() => {
                setShowPasswordForm(false);
                setStep(1);
              }} sx={{ ml: 2 }}>Hủy</Button>
            </Box>
          </Box>
        )}

        {user?.userType === "Member" && (
          <Box sx={{ mt: 6 }}>
            <Typography className="membership-history-title">Huy hiệu của bạn</Typography>
            {badges.length === 0 ? (
              <Typography className="membership-history-empty">Chưa có huy hiệu nào.</Typography>
            ) : (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mt: 2 }}>
                {badges.map((b, idx) => (
                  <Box key={b.badgeId || idx} sx={{ textAlign: 'center', width: 100 }}>
                    <img src={
                      b.iconUrl?.startsWith("http")
                        ? b.iconUrl
                        : `${baseApiUrl}${b.iconUrl}`
                    } alt={b.name} width={50} height={50} />
                    <Typography variant="body2" fontWeight={600}>{b.name}</Typography>
                  </Box>
                ))}
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
