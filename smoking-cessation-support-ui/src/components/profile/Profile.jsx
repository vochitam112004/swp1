import React, { useState, useEffect } from "react";
import api from "../../api/axios";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [frequency, setFrequency] = useState(() => localStorage.getItem("smokeFrequency") || "");
  const [pricePerPack, setPricePerPack] = useState(() => localStorage.getItem("pricePerPack") || "");
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

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    localStorage.setItem("smokeFrequency", frequency);
    localStorage.setItem("pricePerPack", pricePerPack);
    // Có thể thêm logic cập nhật lên server nếu cần
  };

  if (error) return <div style={{ color: "red" }}>{error}</div>;
  if (!profile) return <div>Đang tải...</div>;

  return (
    <div>
      <h2>Hồ sơ cá nhân</h2>
      <p><b>Tên hiển thị:</b> {profile.displayName}</p>
      <p><b>Email:</b> {profile.email}</p>
      <p><b>Số điện thoại:</b> {profile.phoneNumber}</p>
      <p><b>Mã thành viên:</b> {profile.memberId}</p>
      <p><b>Mã người dùng:</b> {profile.userId}</p>
      <p><b>Tình trạng hút thuốc:</b> {profile.smokingStatus}</p>
      <p><b>Số lần cố gắng bỏ thuốc:</b> {profile.quitAttempts}</p>
      <p><b>Cấp độ kinh nghiệm:</b> {profile.experience_level}</p>
      <p><b>Lịch sử cố gắng trước đây:</b> {profile.previousAttempts}</p>
      <form onSubmit={handleProfileUpdate}>
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
        <button type="submit">Cập nhật</button>
      </form>
    </div>
  );
}