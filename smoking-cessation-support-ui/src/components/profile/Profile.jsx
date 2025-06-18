import React, { useState, useEffect } from "react";
import api from "../../api/axios";

export default function Profile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    // Lấy thông tin từ backend hoặc localStorage
    api.get("/user/profile").then(res => setProfile(res.data));
  }, []);

  if (!profile) return <div>Đang tải...</div>;

  return (
    <div>
      <h2>Hồ sơ cá nhân</h2>
      <p><b>Tên hiển thị:</b> {profile.displayName}</p>
      <p><b>Email:</b> {profile.email}</p>
      <p><b>Số điện thoại:</b> {profile.phoneNumber}</p>
      {/* Thêm form cập nhật, đổi mật khẩu, avatar, lịch sử gói... */}
    </div>
  );
}