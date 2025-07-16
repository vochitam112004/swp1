import React from "react";
import "../../css/Developers.css"; // Import your CSS styles

const developers = [
  {
    name: "Võ Chí Tâm",
    role: "Backend Developer",
    desc: "Xây dựng hệ thống máy chủ và API.",
    img: "/images/Developer.jpg",
    color: "#4A90E2",
  },
  {
    name: "Nguyễn Thanh Liêm",
    role: "Backend Developer",
    desc: "Xây dựng hệ thống máy chủ và API.",
    img: "/images/Developer.jpg",
    color: "#D96BA0",
  },
  {
    name: "Trần Đình Phong",
    role: "Frontend Developer",
    desc: "Phát triển giao diện người dùng.",
    img: "/images/Developer.jpg",
    color: "#50C3C8",
  },
  {
    name: "Nguyễn Thành Lợi",
    role: "Frontend Developer",
    desc: "Phát triển giao diện người dùng.",
    img: "/images/Developer.jpg",
    color: "#B6D7A8",
  },
  {
    name: "Đặng Thanh Tú",
    role: "Frontend Developer",
    desc: "Phát triển giao diện người dùng.",
    img: "/images/Developer.jpg",
    color: "#E2C2F0",
  },
];

const Developers = () => (
  <div className="dev-team-bg">
    <h2 className="dev-team-title">Gặp Gỡ Nhóm Chúng Tôi</h2>
    <p className="dev-team-desc">
      Đội ngũ phát triển của chúng tôi luôn tận tâm xây dựng nền tảng tốt nhất cho bạn.
    </p>
    <div className="dev-team-list">
      {developers.map((dev, idx) => (
        <div className="dev-card" key={idx}>
          <div className="dev-img-wrap">
            <img src={dev.img} alt={dev.name} className="dev-img" />
            <div className="dev-number" style={{ background: dev.color }}>
              {String(idx + 1).padStart(2, "0")}
            </div>
          </div>
          <div className="dev-name">{dev.name}</div>
          <div className="dev-role" style={{ color: dev.color }}>{dev.role}</div>
          <div className="dev-desc">{dev.desc}</div>
        </div>
      ))}
    </div>
  </div>
);

export default Developers;