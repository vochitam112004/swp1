import React from "react";
import "../../css/Developers.css"; // Dùng lại CSS hoặc tạo file riêng nếu muốn

const researchers = [
  {
    name: "TS. Phạm Văn I",
    title: "Nghiên cứu cộng đồng",
    desc: "Phân tích tác động của thuốc lá đến sức khỏe cộng đồng.",
    img: "/images/researchers.jpg",
    color: "#4A90E2",
  },
  {
    name: "ThS. Nguyễn Thị K",
    title: "Dịch tễ học",
    desc: "Thống kê và đánh giá dữ liệu sức khỏe.",
    img: "/images/researchers.jpg",
    color: "#D96BA0",
  },
  {
    name: "TS. Lê Văn L",
    title: "Y tế công cộng",
    desc: "Nghiên cứu giải pháp cai thuốc quy mô lớn.",
    img: "/images/researchers.jpg",
    color: "#50C3C8",
  },
  {
    name: "ThS. Trần Thị M",
    title: "phân tích dữ liệu",
    desc: "Phân tích dữ liệu và xu hướng sức khỏe.",
    img: "/images/researchers.jpg",
    color: "#B6D7A8",
  },
  {
    name: "TS. Đỗ Văn N",
    title: "Chuyên gia sức khỏe",
    desc: "Tư vấn và phát triển chương trình sức khỏe.",
    img: "/images/researchers.jpg",
    color: "#E2C2F0",
  },
];

const Researchers = () => (
  <div className="team-bg">
    <h2 className="team-title">Gặp Gỡ Nhà Nghiên Cứu</h2>
    <p className="team-desc">
      Đội ngũ nhà nghiên cứu luôn đồng hành, phân tích và phát triển các giải pháp sức khỏe cộng đồng.
    </p>
    <div className="team-list">
      {researchers.map((e, idx) => (
        <div className="team-card" key={idx}>
          <div className="team-img-wrap">
            <img src={e.img} alt={e.name} className="team-img" />
            <div className="team-number" style={{ background: e.color }}>
              {String(idx + 1).padStart(2, "0")}
            </div>
          </div>
          <div className="team-name">{e.name}</div>
          <div className="team-role" style={{ color: e.color }}>{e.title}</div>
          <div className="team-desc2">{e.desc}</div>
        </div>
      ))}
    </div>
  </div>
);

export default Researchers;