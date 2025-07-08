import React from "react";
import "../../css/Developers.css"; // Tạo file CSS này

const chuyengia = [
  {
    name: "TS. Nguyễn Văn A",
    title: "Chuyên gia Tâm lý học",
    desc: "20 năm kinh nghiệm hỗ trợ cai thuốc lá.",
    img: "/images/chuyengia.jpg",
    color: "#4A90E2",
  },
  {
    name: "BS. Trần Thị B",
    title: "Bác sĩ Hô hấp",
    desc: "Chuyên gia tư vấn sức khỏe cộng đồng.",
    img: "/images/chuyengia.jpg",
    color: "#D96BA0",
  },
  {
    name: "TS. Lê Văn C",
    title: "Chuyên gia Tâm thần học",
    desc: "Nghiên cứu về hành vi nghiện.",
    img: "/images/chuyengia.jpg",
    color: "#50C3C8",
  },
  {
    name: "ThS. Phạm Thị D",
    title: "Chuyên gia Tư vấn",
    desc: "Đào tạo kỹ năng cai nghiện.",
    img: "/images/chuyengia.jpg",
    color: "#B6D7A8",
  },
];

const Chuyengia = () => (
  <div className="team-bg">
    <h2 className="team-title">Gặp Gỡ Chuyên Gia</h2>
    <p className="team-desc">
      Đội ngũ chuyên gia y tế và tâm lý đồng hành cùng bạn trên hành trình cai thuốc lá.
    </p>
    <div className="team-list">
      {chuyengia.map((e, idx) => (
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

export default Chuyengia;