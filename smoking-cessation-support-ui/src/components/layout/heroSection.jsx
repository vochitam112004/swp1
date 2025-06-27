import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext'

const HeroSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleStartClick = (e) => {
    e.preventDefault();
    navigate('/register');
  };

  return (
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
            {!user && (
              <button
                className="btn btn-light text-primary fw-semibold px-4 py-2 shadow-sm"
                onClick={handleStartClick}
              >
                Bắt đầu hành trình
                <i className="fas fa-arrow-right ms-2"></i>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;