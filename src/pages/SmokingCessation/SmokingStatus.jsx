import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // 👈 Thêm dòng này

const SmokingStatus = () => {
  const [form, setForm] = useState({
    cigarettesPerDay: "",
    frequency: "",
    pricePerPack: "",
    notes: "",
  });

  const navigate = useNavigate(); // 👈 Thêm dòng này

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Smoking Status Submitted:", form);
    // TODO: gửi dữ liệu lên backend hoặc lưu localStorage

    // 👇 Chuyển hướng về trang đăng nhập sau khi submit
    navigate("/login");
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-2xl mt-8">
      <h2 className="text-2xl font-bold mb-4">Ghi nhận tình trạng hút thuốc</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Số điếu thuốc mỗi ngày:</label>
          <input
            type="number"
            name="cigarettesPerDay"
            value={form.cigarettesPerDay}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            min="0"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Tần suất hút (ví dụ: mỗi 2 giờ):</label>
          <input
            type="text"
            name="frequency"
            value={form.frequency}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Giá tiền mỗi bao thuốc (VNĐ):</label>
          <input
            type="number"
            name="pricePerPack"
            value={form.pricePerPack}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            min="0"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Ghi chú thêm:</label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows="3"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Lưu thông tin
        </button>
      </form>
    </div>
  );
};

export default SmokingStatus;
