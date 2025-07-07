import React from "react";

const chuyengia = [
  { name: "TS. Nguyễn Văn A", title: "Chuyên gia Tâm lý học", desc: "20 năm kinh nghiệm hỗ trợ cai thuốc lá." },
  { name: "BS. Trần Thị B", title: "Bác sĩ Hô hấp", desc: "Chuyên gia tư vấn sức khỏe cộng đồng." },
  { name: "TS. Lê Văn C", title: "Chuyên gia Tâm thần học", desc: "Nghiên cứu về hành vi nghiện." },
  { name: "ThS. Phạm Thị D", title: "Chuyên gia Tư vấn", desc: "Đào tạo kỹ năng cai nghiện." },
  { name: "BS. Đỗ Văn E", title: "Bác sĩ Nội khoa", desc: "Tư vấn sức khỏe tổng quát." },
];

const Chuyengia = () => (
  <div className="about-bg">
    <div className="about-container">
      <div className="about-paper">
        <div className="about-title">Chuyên gia y tế và tâm lý</div>
        <ul className="about-list">
          {chuyengia.map((e, idx) => (
            <li key={idx}>
              <strong>{e.name}</strong> - {e.title}
              <div style={{ fontSize: 15, color: "#555" }}>{e.desc}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

export default Chuyengia;