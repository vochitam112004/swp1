import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import { TextField, Button, Avatar, Typography, Box, Paper } from "@mui/material";
import { toast } from "react-toastify";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({});
  const [avatarFile, setAvatarFile] = useState(null);
  const [error, setError] = useState("");
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwords, setPasswords] = useState({ old: "", new1: "", new2: "" });
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // Lấy thông tin hồ sơ
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      setError("Bạn chưa đăng nhập.");
      return;
    }
    let id;
    try {
      const user = JSON.parse(userStr);
      id = user.id;
      if (!id) throw new Error();
    } catch {
      setError("Không tìm thấy thông tin tài khoản.");
      return;
    }
    api.get(`/MemberProfile/${id}`)
      .then(res => {
        setProfile(res.data);
        setForm(res.data);
      })
      .catch(err => {
        setError("Không lấy được thông tin hồ sơ.");
        toast.error("Không lấy được thông tin hồ sơ!");
      });
    // Lấy lịch sử gói
    api.get(`/Membership/history/${id}`)
      .then(res => setHistory(res.data))
      .catch(() => {
        toast.error("Không lấy được lịch sử gói thành viên!");
      });
  }, []);

  // Cập nhật thông tin cá nhân
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    // Validate email
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      toast.error("Email không hợp lệ!");
      return;
    }
    // Validate phone
    if (form.phoneNumber && !/^0\d{9,10}$/.test(form.phoneNumber)) {
      toast.error("Số điện thoại không hợp lệ!");
      return;
    }
    try {
      await api.put("/MemberProfile/update", form);
      toast.success("Cập nhật thành công!");
      setEdit(false);
      setProfile({ ...profile, ...form });
    } catch {
      toast.error("Cập nhật thất bại!");
    }
  };

  // Đổi mật khẩu
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
        userId: profile.userId,
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

  // Đổi avatar
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file ảnh!");
      return;
    }
    setAvatarFile(file);
    const formData = new FormData();
    formData.append("avatar", file);
    formData.append("userId", profile.userId);
    try {
      const res = await api.post("/MemberProfile/upload-avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setProfile({ ...profile, avatar: res.data.avatar });
      toast.success("Cập nhật ảnh đại diện thành công!");
    } catch {
      toast.error("Cập nhật ảnh đại diện thất bại!");
    }
  };

  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!profile) return <div>Đang tải...</div>;

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", mt: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <Avatar src={profile.avatar} sx={{ width: 64, height: 64 }} />
          <label>
            <input type="file" accept="image/*" hidden onChange={handleAvatarChange} />
            <Button variant="outlined" component="span" size="small">Đổi ảnh</Button>
          </label>
        </Box>
        {!edit ? (
          <>
            <Typography variant="h6">{profile.displayName}</Typography>
            <Typography>Email: {profile.email}</Typography>
            <Typography>SĐT: {profile.phoneNumber}</Typography>
            <Typography>Địa chỉ: {profile.address}</Typography>
            <Typography>Mã thành viên: {profile.memberId}</Typography>
            <Typography>Tình trạng hút thuốc: {profile.smokingStatus}</Typography>
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
            <TextField
              label="Số điện thoại"
              name="phoneNumber"
              value={form.phoneNumber || ""}
              onChange={e => setForm({ ...form, phoneNumber: e.target.value })}
              fullWidth margin="normal"
            />
            <TextField
              label="Địa chỉ"
              name="address"
              value={form.address || ""}
              onChange={e => setForm({ ...form, address: e.target.value })}
              fullWidth margin="normal"
            />
            <Box mt={2}>
              <Button type="submit" variant="contained">Lưu</Button>
              <Button sx={{ ml: 2 }} variant="outlined" onClick={() => setEdit(false)}>Hủy</Button>
            </Box>
          </form>
        )}

        {/* Đổi mật khẩu */}
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
              <Button type="submit" variant="contained">Đổi mật khẩu</Button>
              <Button sx={{ ml: 2 }} variant="outlined" onClick={() => setShowPasswordForm(false)}>Hủy</Button>
            </Box>
          </form>
        )}

        {/* Lịch sử gói thành viên */}
        <Box mt={4}>
          <Typography variant="h6" mb={1}>Lịch sử gói thành viên</Typography>
          {history.length === 0 ? (
            <Typography color="text.secondary">Chưa có lịch sử.</Typography>
          ) : (
            <ul>
              {history.map((h, idx) => (
                <li key={idx}>
                  {h.planName} ({h.startDate} - {h.endDate || "Hiện tại"})
                </li>
              ))}
            </ul>
          )}
        </Box>
      </Paper>
    </Box>
  );
}