import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import { TextField, Button, Avatar, Typography, Box, Paper } from "@mui/material";
import { toast } from "react-toastify";
import { useAuth } from "../auth/AuthContext";

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
      const res = await api.put("/user/update", form);
      toast.success("Cập nhật thông tin thành công!");
      setProfile({ ...profile, ...form });
      setEdit(false);
    } catch (error) {
      toast.error("Cập nhật thất bại!");
      console.error("Cập nhật lỗi:", error);
    }
  };

  const handleChangePassword = async (e) => {
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
      await api.post("/Auth/change-password", {
        userId: user.id,
        oldPassword: passwords.old,
        newPassword: passwords.new1,
      });
      toast.success("Đổi mật khẩu thành công!");
      setShowPasswordForm(false);
      setPasswords({ old: "", new1: "", new2: "" });
    } catch {
      toast.error("Đổi mật khẩu thất bại!");
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
      const res = await api.post("/user/upload-avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setProfile({ ...profile, avatar: res.data.avatar });
      toast.success("Cập nhật ảnh đại diện thành công!");
    } catch {
      toast.error("Cập nhật ảnh đại diện thất bại!");
    }
  };

  if (!profile) return <div>Đang tải...</div>;

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <Avatar src={profile.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.username)}`} sx={{ width: 64, height: 64 }} />
          <label>
            <input type="file" accept="image/*" hidden onChange={handleAvatarChange} />
            <Button variant="outlined" component="span" size="small">Đổi ảnh</Button>
          </label>
        </Box>

        {!edit ? (
          <>
            <Typography variant="h6">{profile.displayName}</Typography>
            <Typography>Email: {profile.email}</Typography>
            <Typography>Tên đăng nhập: {profile.username}</Typography>
            <Typography>Loại người dùng: {profile.userType}</Typography>
            <Typography>Ngày tạo: {new Date(profile.createdAt).toLocaleDateString("vi-VN")}</Typography>
            <Button sx={{ mt: 2 }} variant="contained" onClick={() => setEdit(true)}>Chỉnh sửa thông tin</Button>
            <Button sx={{ mt: 2, ml: 2 }} variant="outlined" onClick={() => setShowPasswordForm(v => !v)}>Đổi mật khẩu</Button>
          </>
        ) : (
          <form onSubmit={handleProfileUpdate}>
            <TextField
              label="Tên hiển thị"
              name="displayName"
              value={form.displayName || ""}
              onChange={e => setForm({ ...form, displayName: e.target.value })}
              fullWidth margin="normal"
            />
            <TextField
              label="Email"
              name="email"
              value={form.email || ""}
              onChange={e => setForm({ ...form, email: e.target.value })}
              fullWidth margin="normal"
            />
            <Box mt={2}>
              <Button type="submit" variant="contained">Lưu</Button>
              <Button sx={{ ml: 2 }} variant="outlined" onClick={() => setEdit(false)}>Hủy</Button>
            </Box>
          </form>
        )}

        {showPasswordForm && (
          <form onSubmit={handleChangePassword} style={{ marginTop: 24 }}>
            <Typography variant="subtitle1" mb={1}>Đổi mật khẩu</Typography>
            <TextField
              label="Mật khẩu cũ"
              type="password"
              value={passwords.old}
              onChange={e => setPasswords({ ...passwords, old: e.target.value })}
              fullWidth margin="dense"
              required
            />
            <TextField
              label="Mật khẩu mới"
              type="password"
              value={passwords.new1}
              onChange={e => setPasswords({ ...passwords, new1: e.target.value })}
              fullWidth margin="dense"
              required
            />
            <TextField
              label="Nhập lại mật khẩu mới"
              type="password"
              value={passwords.new2}
              onChange={e => setPasswords({ ...passwords, new2: e.target.value })}
              fullWidth margin="dense"
              required
            />
            <Box mt={2}>
              {profile.userType !== "google" && (
                <Button
                  sx={{ mt: 2, ml: 2 }}
                  variant="outlined"
                  onClick={() => setShowPasswordForm(v => !v)}
                >
                  Đổi mật khẩu
                </Button>
              )}
              <Button sx={{ ml: 2 }} variant="outlined" onClick={() => setShowPasswordForm(false)}>Hủy</Button>
            </Box>
          </form>
        )}

        <Box mt={4}>
          <Typography variant="h6" mb={1}>Lịch sử gói thành viên</Typography>
          {history.length === 0 ? (
            <Typography color="text.secondary">Chưa có lịch sử.</Typography>
          ) : (
            <ul>
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
