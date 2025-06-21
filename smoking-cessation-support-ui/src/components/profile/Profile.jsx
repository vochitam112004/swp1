import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import { TextField, Button, Avatar, Typography, Box, Paper } from "@mui/material";
import { toast } from "react-toastify";
import { useAuth } from "../auth/AuthContext";
import "../../css/Profile.css";

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState(null);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwords, setPasswords] = useState({ old: "", new1: "", new2: "" });
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (user) {
      setProfile(user);
      setForm(user);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;

    api.get("/membership/history")
      .then(res => {
        if (Array.isArray(res.data)) {
          setHistory(res.data);
        } else {
          setHistory([]);
        }
      })
      .catch(() => {
        toast.error("Không lấy được lịch sử gói thành viên!");
      });
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    if (!form.displayName || !form.email) {
      toast.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(form.email)) {
      toast.error("Email không hợp lệ!");
      return;
    }

    try {
      const res = await api.put("/User", form);
      toast.success("Cập nhật thông tin thành công!");
      setProfile({ ...profile, ...form });
      setEdit(false);
    } catch (error) {
      toast.error("Cập nhật thất bại!");
      console.error("Cập nhật lỗi:", error);
    }
  };

  const handleChangeUsernameAndPassword = async (e) => {
    e.preventDefault();

    // Nếu đổi username nhưng không đổi mật khẩu
    if (form.username && form.username !== user.username) {
      try {
        await api.put("/User", {
          id: user.id,
          username: form.username,
        });
        toast.success("Cập nhật tên đăng nhập thành công!");
        setProfile({ ...profile, username: form.username });
      } catch {
        toast.error("Cập nhật tên đăng nhập thất bại!");
        return;
      }
    }

    // Nếu có nhập mật khẩu mới thì đổi mật khẩu
    if (passwords.new1 || passwords.new2 || passwords.old) {
      if (passwords.new1.length < 6) {
        toast.error("Mật khẩu mới phải từ 6 ký tự!");
        return;
      }
      if (passwords.new1 !== passwords.new2) {
        toast.error("Mật khẩu mới không khớp!");
        return;
      }
      try {
        await api.post("/Auth/change-password", {
          userId: user.id,
          oldPassword: passwords.old,
          newPassword: passwords.new1,
        });
        toast.success("Đổi mật khẩu thành công!");
        setPasswords({ old: "", new1: "", new2: "" });
        setShowPasswordForm(false);
      } catch {
        toast.error("Đổi mật khẩu thất bại!");
      }
    }
  };


  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file ảnh!");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const res = await api.put("/User", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setProfile({ ...profile, avatarUrl: res.data.avatar });
      toast.success("Cập nhật ảnh đại diện thành công!");
    } catch {
      toast.error("Cập nhật ảnh đại diện thất bại!");
    }
  };

  if (!profile) return <div>Đang tải...</div>;

  return (
    <Box className="profile-container">
      <Paper className="profile-paper" elevation={6}>
        <Box className="profile-avatar-container">
          <Avatar
            src={profile.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.username)}`}
            className="profile-avatar"
          />
          <label>
            <input type="file" accept="image/*" hidden onChange={handleAvatarChange} />
            <Button variant="outlined" component="span" size="medium" sx={{ textTransform: "none" }}>
              Đổi ảnh
            </Button>
          </label>
        </Box>

        {/* Luôn hiện phần thông tin này */}
        <Typography className="profile-name">{profile.displayName}</Typography>
        <Typography className="profile-info"><strong>Email:</strong> {profile.email}</Typography>
        <Typography className="profile-info"><strong>Tên đăng nhập:</strong> {profile.username}</Typography>
        <Typography className="profile-info"><strong>Loại người dùng:</strong> {profile.userType}</Typography>
        <Typography className="profile-info"><strong>Số điện thoại:</strong> {profile.phoneNumber || "Chưa cập nhật"}</Typography>
        <Typography className="profile-info"><strong>Địa chỉ:</strong> {profile.address || "Chưa cập nhật"}</Typography>
        <Typography className="profile-createdAt">
          Ngày tạo: {new Date(profile.createdAt).toLocaleDateString("vi-VN")}
        </Typography>

        {/* Nút bật/tắt form */}
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
              setShowPasswordForm(prev => {
                if (!prev) setEdit(false);
                return !prev;
              });
            }}
          >
            Đổi tên đăng nhập và mật khẩu
          </Button>
        </Box>


        {/* Form chỉnh sửa thông tin - hiện bên dưới */}
        {edit && (
          <form onSubmit={handleProfileUpdate} className="edit-form" style={{ marginTop: 24 }}>
            <TextField
              label="Tên hiển thị"
              name="displayName"
              value={form.displayName || ""}
              onChange={e => setForm({ ...form, displayName: e.target.value })}
              fullWidth
              autoFocus
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
            <Box className="edit-form-buttons" sx={{ mt: 2 }}>
              <Button type="submit" variant="contained">Lưu</Button>
              <Button variant="outlined" onClick={() => setEdit(false)} sx={{ ml: 2 }}>Hủy</Button>
            </Box>
          </form>
        )}

        {/* Form đổi tên đăng nhập và mật khẩu - hiện bên dưới */}
        {showPasswordForm && (
          <Box component="form" onSubmit={handleChangeUsernameAndPassword} className="password-form" sx={{ mt: 4 }}>
            <TextField
              label="Tên đăng nhập mới"
              value={form.username || ""}
              onChange={e => setForm({ ...form, username: e.target.value })}
              fullWidth
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
            <Box className="password-form-buttons" sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
              <Button type="submit" variant="contained">Lưu thay đổi</Button>
              <Button variant="outlined" onClick={() => setShowPasswordForm(false)} sx={{ ml: 2 }}>Hủy</Button>
            </Box>
          </Box>
        )}

        {/* Lịch sử gói thành viên */}
        <Box className="membership-history" sx={{ mt: 6 }}>
          <Typography className="membership-history-title">
            Lịch sử gói thành viên
          </Typography>
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
      </Paper>
    </Box>
  );

}
