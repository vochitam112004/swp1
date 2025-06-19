import React, { useState, useEffect } from "react";
import api from "../../api/axios";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      setError("Bạn chưa đăng nhập.");
      return;
    }
    let id;
    try {
      const user = JSON.parse(userStr);
      id = user.id;
      if (id === undefined || id === null) throw new Error();
    } catch {
      setError("Không tìm thấy thông tin tài khoản.");
      return;
    }
    api.get(`/MemberProfile/${id}`)
      .then(res => setProfile(res.data))
      .catch(err => {
        setError(
          err?.response?.data?.message ||
          "Không lấy được thông tin hồ sơ."
        );
      });
  }, []);

  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!profile) return <div>Đang tải...</div>;

  return (
    <div>
      <h2>Hồ sơ cá nhân</h2>
      <p><b>Mã thành viên:</b> {profile.memberId}</p>
      <p><b>Mã người dùng:</b> {profile.userId}</p>
      <p><b>Tình trạng hút thuốc:</b> {profile.smokingStatus}</p>
      <p><b>Số lần cố gắng bỏ thuốc:</b> {profile.quitAttempts}</p>
      <p><b>Cấp độ kinh nghiệm:</b> {profile.experience_level}</p>
      <p><b>Lịch sử cố gắng trước đây:</b> {profile.previousAttempts}</p>
    </div>
  );
}