import { Link } from 'react-router-dom';
import { Button } from '@mui/material';

const FeaturesSection = () => (
  <div className="py-5 bg-light">
    <div className="container">
      <div className="text-center mb-5">
        <h2 className="text-primary text-uppercase fw-semibold fs-6">
          Tại sao chọn Breathe Free
        </h2>
        <p className="mt-2 display-6 fw-bold text-dark">
          Tất cả công cụ bạn cần để bỏ thuốc lá thành công
        </p>
        <p className="mt-3 mx-auto fs-5 text-secondary" style={{maxWidth: 700}}>
          Chúng tôi cung cấp giải pháp toàn diện giúp bạn từ bỏ thói quen hút thuốc.
        </p>
          <Button 
          component={Link} to="/about" variant="contained" color="primary"  sx={{ mt: 2 }} >
          Tìm hiểu về Breathe Free
        </Button>
      </div>

      <div className="row g-4">
        {/* Feature 1 */}
        <div className="col-md-6">
          <div className="d-flex align-items-start">
            <div className="bg-primary text-white rounded-3 d-flex align-items-center justify-content-center me-3" style={{width: 48, height: 48}}>
              <i className="fas fa-clipboard-list fs-4"></i>
            </div>
            <div>
              <h3 className="fs-5 fw-semibold mb-1">Kế hoạch cá nhân hóa</h3>
              <p className="mb-0 text-secondary">
                Hệ thống tạo kế hoạch cai thuốc phù hợp với thói quen của bạn, với các giai đoạn rõ ràng và mục tiêu cụ thể.
              </p>
            </div>
          </div>
        </div>
        {/* Feature 2 */}
        <div className="col-md-6">
          <div className="d-flex align-items-start">
            <div className="bg-success text-white rounded-3 d-flex align-items-center justify-content-center me-3" style={{width: 48, height: 48}}>
              <i className="fas fa-chart-line fs-4"></i>
            </div>
            <div>
              <h3 className="fs-5 fw-semibold mb-1">Theo dõi tiến trình</h3>
              <p className="mb-0 text-secondary">
                Ghi nhận tình trạng hút thuốc, thống kê số ngày không hút, tiền tiết kiệm và cải thiện sức khỏe theo thời gian.
              </p>
            </div>
          </div>
        </div>
        {/* Feature 3 */}
        <div className="col-md-6">
          <div className="d-flex align-items-start">
            <div className="bg-info text-white rounded-3 d-flex align-items-center justify-content-center me-3" style={{width: 48, height: 48}}>
              <i className="fas fa-medal fs-4"></i>
            </div>
            <div>
              <h3 className="fs-5 fw-semibold mb-1">Hệ thống huy hiệu</h3>
              <p className="mb-0 text-secondary">
                Nhận huy hiệu thành tích khi đạt các cột mốc quan trọng, chia sẻ để lan tỏa động lực cho cộng đồng.
              </p>
            </div>
          </div>
        </div>
        {/* Feature 4 */}
        <div className="col-md-6">
          <div className="d-flex align-items-start">
            <div className="bg-warning text-white rounded-3 d-flex align-items-center justify-content-center me-3" style={{width: 48, height: 48}}>
              <i className="fas fa-comments fs-4"></i>
            </div>
            <div>
              <h3 className="fs-5 fw-semibold mb-1">Hỗ trợ từ chuyên gia</h3>
              <p className="mb-0 text-secondary">
                Trò chuyện trực tiếp với huấn luyện viên cai thuốc lá và nhận lời khuyên từ cộng đồng những người cùng chí hướng.
              </p>
            </div>
          </div>
        </div>
        {/* Feature 5 */}
        <div className="col-md-6">
          <div className="d-flex align-items-start">
            <div className="bg-danger text-white rounded-3 d-flex align-items-center justify-content-center me-3" style={{width: 48, height: 48}}>
              <i className="fas fa-bell fs-4"></i>
            </div>
            <div>
              <h3 className="fs-5 fw-semibold mb-1">Nhắc nhở thông minh</h3>
              <p className="mb-0 text-secondary">
                Hệ thống gửi thông báo động viên kịp thời, nhắc nhở lý do cai thuốc khi bạn có nguy cơ tái nghiện.
              </p>
            </div>
          </div>
        </div>
        {/* Feature 6 */}
        <div className="col-md-6">
          <div className="d-flex align-items-start">
            <div className="bg-secondary text-white rounded-3 d-flex align-items-center justify-content-center me-3" style={{width: 48, height: 48}}>
              <i className="fas fa-mobile-alt fs-4"></i>
            </div>
            <div>
              <h3 className="fs-5 fw-semibold mb-1">Mọi lúc mọi nơi</h3>
              <p className="mb-0 text-secondary">
                Truy cập từ mọi thiết bị, đồng bộ dữ liệu liên tục giúp bạn luôn kiểm soát được hành trình cai thuốc.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default FeaturesSection;