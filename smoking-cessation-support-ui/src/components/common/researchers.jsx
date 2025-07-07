import React from "react";

const researchers = [
  { name: "TS. Phạm Văn I", field: "Nghiên cứu cộng đồng", desc: "Phân tích tác động của thuốc lá." },
  { name: "ThS. Nguyễn Thị K", field: "Dịch tễ học", desc: "Thống kê và đánh giá dữ liệu sức khỏe." },
  { name: "TS. Lê Văn L", field: "Y tế công cộng", desc: "Nghiên cứu giải pháp cai thuốc quy mô lớn." },
];

const Researchers = () => (
  <div className="about-bg">
    <div className="about-container">
      <div className="about-paper">
        <div className="about-title">Nhà nghiên cứu về sức khỏe cộng đồng</div>
        <ul className="about-list">
          {researchers.map((r, idx) => (
            <li key={idx}>
              <strong>{r.name}</strong> - {r.field}
              <div style={{ fontSize: 15, color: "#555" }}>{r.desc}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

export default Researchers;