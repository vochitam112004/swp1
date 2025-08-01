import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import '../../css/FeaturesSection.css';

const FeaturesSection = () => (
  <div className="py-5 bg-light features-section">
    <div className="container">
      <div className="text-center mb-5">
        <h2 className="display-6 fw-bold text-dark mb-4">
          Tính năng nổi bật
        </h2>
        <p className="fs-5 text-secondary mb-4">
          Hệ thống hỗ trợ toàn diện giúp bạn thành công trong việc cai thuốc lá
        </p>
      </div>

      <div className="row g-4">
        {/* Feature 1 - Theo dõi tiến trình */}
        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm features-card" style={{backgroundColor: '#d4f8d4'}}>
            <div className="card-body p-4 text-center">
              <div className="mb-3">
                <i className="fas fa-chart-line fs-1 text-success"></i>
              </div>
              <h3 className="fs-5 fw-bold mb-3 text-dark">Theo dõi tiến trình</h3>
              <p className="text-dark mb-0">
                Ghi nhận và theo dõi chi tiết quá trình cai thuốc với thước đo tiến triển và khỏe cả nhìn
              </p>
            </div>
          </div>
        </div>

        {/* Feature 2 - Kế hoạch cá nhân */}
        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm features-card" style={{backgroundColor: '#d4e8ff'}}>
            <div className="card-body p-4 text-center">
              <div className="mb-3">
                <i className="fas fa-calendar-alt fs-1 text-primary"></i>
              </div>
              <h3 className="fs-5 fw-bold mb-3 text-dark">Kế hoạch cá nhân</h3>
              <p className="text-dark mb-0">
                Lập kế hoạch cai thuốc phù hợp với định hướng và mục tiêu cá nhân của bạn
              </p>
            </div>
          </div>
        </div>

        {/* Feature 3 - Huy hiệu thành tích */}
        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm features-card" style={{backgroundColor: '#f0e6ff'}}>
            <div className="card-body p-4 text-center">
              <div className="mb-3">
                <i className="fas fa-medal fs-1 text-purple"></i>
              </div>
              <h3 className="fs-5 fw-bold mb-3 text-dark">Huy hiệu thành tích</h3>
              <p className="text-dark mb-0">
                Nhận huy hiệu khi đạt các cột mốc quan trọng trong hành trình cai thuốc
              </p>
            </div>
          </div>
        </div>

        {/* Feature 4 - Nhắc nhở thông minh */}
        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm features-card" style={{backgroundColor: '#fff3cd'}}>
            <div className="card-body p-4 text-center">
              <div className="mb-3">
                <i className="fas fa-bell fs-1 text-warning"></i>
              </div>
              <h3 className="fs-5 fw-bold mb-3 text-dark">Nhắc nhở thông minh</h3>
              <p className="text-dark mb-0">
                Thông báo động viên và nhắc nhở lý do cai thuốc để duy trì động lực
              </p>
            </div>
          </div>
        </div>

        {/* Feature 5 - Cộng đồng hỗ trợ */}
        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm features-card" style={{backgroundColor: '#fce4ec'}}>
            <div className="card-body p-4 text-center">
              <div className="mb-3">
                <i className="fas fa-users fs-1 text-danger"></i>
              </div>
              <h3 className="fs-5 fw-bold mb-3 text-dark">Cộng đồng hỗ trợ</h3>
              <p className="text-dark mb-0">
                Kết nối với cộng đồng chia sẻ kinh nghiệm và nhận động viên từ mọi người
              </p>
            </div>
          </div>
        </div>

        {/* Feature 6 - Tư vấn chuyên gia */}
        <div className="col-md-4">
          <div className="card h-100 border-0 shadow-sm features-card" style={{backgroundColor: '#e0f7fa'}}>
            <div className="card-body p-4 text-center">
              <div className="mb-3">
                <i className="fas fa-user-md fs-1 text-info"></i>
              </div>
              <h3 className="fs-5 fw-bold mb-3 text-dark">Tư vấn chuyên gia</h3>
              <p className="text-dark mb-0">
                Trò chuyện trực tiếp với huấn luyện viên để nhận lời khuyên chuyên nghiệp
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default FeaturesSection;