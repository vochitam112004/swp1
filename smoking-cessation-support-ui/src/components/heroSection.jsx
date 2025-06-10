//Phần giới thiệu đầu trang.
import React from 'react';

const HeroSection = () => (
  <div className="hero-gradient text-white py-5">
    <div className="container py-5">
      <div className="text-center">
        <h1 className="display-4 fw-bold mb-4">
          Hãy cùng chúng tôi đánh bại thuốc lá!
        </h1>
        <p className="fs-4 mx-auto mb-4" style={{ maxWidth: 600 }}>
          Breathe Free - Nền tảng hỗ trợ cai thuốc lá hiệu quả với cộng đồng mạnh mẽ, kế hoạch cá nhân hóa và theo dõi tiến trình chi tiết.
        </p>
        <div className="mt-4">
          <a
            href="#"
            className="btn btn-light text-primary fw-semibold px-4 py-2 shadow-sm"
          >
            Bắt đầu hành trình
            <i className="fas fa-arrow-right ms-2"></i>
          </a>
        </div>
      </div>
    </div>
  </div>
);

export default HeroSection;