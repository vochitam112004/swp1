import React from "react";
import "../../css/Footer.css"; // Import CSS styles for the About component

const About = () => (
  <div className="about-bg">
    <div className="about-container">
      <div className="about-paper">
        <div className="about-title">Giới thiệu về Breathe Free</div>
        <div style={{ fontSize: 18, marginBottom: 16 }}>
          <strong>Breathe Free</strong> là nền tảng hỗ trợ cai thuốc lá, giúp người dùng xây dựng lối sống lành mạnh và vượt qua thói quen hút thuốc. Chúng tôi cung cấp các tài nguyên, công cụ và sự đồng hành từ đội ngũ chuyên gia để bạn có thể đạt được mục tiêu của mình.
        </div>
        <div className="about-section-title">Sứ mệnh của chúng tôi</div>
        <div style={{ fontSize: 17, marginBottom: 16 }}>
          Chúng tôi mong muốn tạo ra một cộng đồng không khói thuốc, nơi mọi người đều được hỗ trợ và truyền cảm hứng để sống khỏe mạnh hơn mỗi ngày.
        </div>
        <div className="about-section-title">Đội ngũ phát triển</div>
        <ul className="about-list">
          <li>Chuyên gia y tế và tâm lý</li>
          <li>Nhà phát triển phần mềm</li>
          <li>Nhà nghiên cứu về sức khỏe cộng đồng</li>
        </ul>
        <div className="about-section-title">Liên hệ</div>
        <div className="about-contact" style={{ fontSize: 16 }}>
          Nếu bạn có bất kỳ câu hỏi hoặc góp ý nào, vui lòng liên hệ với chúng tôi qua email:{" "}
          <a href="mailto:support@breathefree.vn">
            support@breathefree.vn
          </a>
        </div>
      </div>
    </div>
  </div>
);

export default About;