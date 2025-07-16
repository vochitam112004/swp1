import { useState } from "react";
import FeedbackForm from "../common/FeedbackForm";
import FeedbackList from "../common/FeedbackList";

const Testimonials = () => {
  const [refresh, setRefresh] = useState(0);
  return (
    <div className="bg-light py-5">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="text-primary text-uppercase fw-semibold fs-6">
            Câu chuyện thành công
          </h2>
          <p className="mt-2 display-6 fw-bold text-dark">
            Những người đã từ bỏ thuốc lá thành công
          </p>
        </div>
        <div className="row g-4">
          {/* Testimonial 1 */}
          <div className="col-md-4">
            <div className="bg-white p-4 rounded shadow-lg border h-100">
              <div className="d-flex align-items-center mb-3">
                <img
                  className="rounded-circle object-cover"
                  style={{ width: 48, height: 48 }}
                  src="https://randomuser.me/api/portraits/men/32.jpg"
                  alt="User avatar"
                />
                <div className="ms-3">
                  <h4 className="fs-5 fw-semibold mb-0 text-dark">Nguyễn Văn An</h4>
                  <p className="text-secondary mb-0">Đã bỏ thuốc 6 tháng</p>
                </div>
              </div>
              <div className="text-secondary mb-3">
                <p className="mb-0">
                  "Tôi đã hút thuốc trong 15 năm và nghĩ mình không thể bỏ được. Nhờ
                  Breathe Free với kế hoạch rõ ràng và động lực từ cộng đồng, tôi đã bỏ
                  thuốc thành công sau 3 tháng. Giờ đây sức khỏe tôi cải thiện rõ rệt!"
                </p>
              </div>
              <div className="mt-2">
                <i className="fas fa-star text-warning"></i>
                <i className="fas fa-star text-warning"></i>
                <i className="fas fa-star text-warning"></i>
                <i className="fas fa-star text-warning"></i>
                <i className="fas fa-star text-warning"></i>
              </div>
            </div>
          </div>
          {/* Testimonial 2 */}
          <div className="col-md-4">
            <div className="bg-white p-4 rounded shadow-lg border h-100">
              <div className="d-flex align-items-center mb-3">
                <img
                  className="rounded-circle object-cover"
                  style={{ width: 48, height: 48 }}
                  src="https://randomuser.me/api/portraits/women/44.jpg"
                  alt="User avatar"
                />
                <div className="ms-3">
                  <h4 className="fs-5 fw-semibold mb-0 text-dark">Trần Thị Bình</h4>
                  <p className="text-secondary mb-0">Đã bỏ thuốc 1 năm</p>
                </div>
              </div>
              <div className="text-secondary mb-3">
                <p className="mb-0">
                  "Các thông báo nhắc nhở đúng lúc và lời động viên từ hệ thống thực sự
                  giúp tôi vượt qua những cơn thèm thuốc khó khăn. Tôi đặc biệt thích
                  tính năng thống kê tiền tiết kiệm, giúp tôi có thêm động lực."
                </p>
              </div>
              <div className="mt-2">
                <i className="fas fa-star text-warning"></i>
                <i className="fas fa-star text-warning"></i>
                <i className="fas fa-star text-warning"></i>
                <i className="fas fa-star text-warning"></i>
                <i className="fas fa-star-half-alt text-warning"></i>
              </div>
            </div>
          </div>
          {/* Testimonial 3 */}
          <div className="col-md-4">
            <div className="bg-white p-4 rounded shadow-lg border h-100">
              <div className="d-flex align-items-center mb-3">
                <img
                  className="rounded-circle object-cover"
                  style={{ width: 48, height: 48 }}
                  src="https://randomuser.me/api/portraits/men/75.jpg"
                  alt="User avatar"
                />
                <div className="ms-3">
                  <h4 className="fs-5 fw-semibold mb-0 text-dark">Lê Hoàng Nam</h4>
                  <p className="text-secondary mb-0">Đã bỏ thuốc 3 tháng</p>
                </div>
              </div>
              <div className="text-secondary mb-3">
                <p className="mb-0">
                  "Huấn luyện viên của Breathe Free đã tư vấn cho tôi những phương pháp
                  khoa học để vượt qua cơn nghiện. Nhờ đó tôi đã giảm từ 20 điếu/ngày
                  xuống 0 điếu chỉ sau 8 tuần. Cảm ơn đội ngũ đã hỗ trợ tôi tận tình!"
                </p>
              </div>
              <div className="mt-2">
                <i className="fas fa-star text-warning"></i>
                <i className="fas fa-star text-warning"></i>
                <i className="fas fa-star text-warning"></i>
                <i className="fas fa-star text-warning"></i>
                <i className="fas fa-star text-warning"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="row mt-5">
          <div className="col-md-5 mb-4 mb-md-0">
            <FeedbackForm onSubmitted={() => setRefresh(r => r + 1)} />
          </div>
          <div className="col-md-7">
            <FeedbackList refreshTrigger={refresh} />
          </div>
        </div>
      </div>
    </div>
  )
};
export default Testimonials;