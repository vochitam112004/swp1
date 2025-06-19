import React, { useState, useEffect } from "react";
import api from "../../api/axios";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [frequency, setFrequency] = useState(() => localStorage.getItem("smokeFrequency") || "");
  const [pricePerPack, setPricePerPack] = useState(() => localStorage.getItem("pricePerPack") || "");

  useEffect(() => {
    // Lấy thông tin từ backend hoặc localStorage
    api.get("/user/profile").then(res => setProfile(res.data));
  }, []);

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    localStorage.setItem("smokeFrequency", frequency);
    localStorage.setItem("pricePerPack", pricePerPack);
    // ...existing code...
  };

  if (!profile) return <div>Đang tải...</div>;

  return (
    <div>
      <h2>Hồ sơ cá nhân</h2>
      <p><b>Tên hiển thị:</b> {profile.displayName}</p>
      <p><b>Email:</b> {profile.email}</p>
      <p><b>Số điện thoại:</b> {profile.phoneNumber}</p>
      {/* Thêm form cập nhật, đổi mật khẩu, avatar, lịch sử gói... */}
      <form onSubmit={handleProfileUpdate}>
        {/* ...existing fields... */}
        <div>
          <label>
            Tần suất hút/ngày:&nbsp;
            <input
              type="number"
              min="1"
              value={frequency}
              onChange={e => setFrequency(e.target.value)}
              required
            />
            &nbsp;điếu/ngày
          </label>
        </div>
        <div>
          <label>
            Giá tiền/bao:&nbsp;
            <input
              type="number"
              min="1000"
              step="1000"
              value={pricePerPack}
              onChange={e => setPricePerPack(e.target.value)}
              required
            />
            &nbsp;VNĐ/bao
          </label>
        </div>
        {/* ...existing fields... */}
        <button type="submit">Cập nhật</button>
      </form>
    </div>
  );
}