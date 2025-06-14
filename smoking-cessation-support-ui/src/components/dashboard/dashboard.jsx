// Có thể là giao diện chính người dùng.
import React from "react";

const Dashboard = () => {
  return (
    <div className="bg-white py-5">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="text-primary text-uppercase fw-semibold fs-6">Dashboard cá nhân</h2>
          <p className="mt-2 display-6 fw-bold text-dark">
            Theo dõi tiến trình cai thuốc của bạn
          </p>
        </div>

        <div className="bg-white shadow rounded-4 overflow-hidden">
          {/* Tabs */}
          <ul className="nav nav-tabs px-3 pt-3">
            <li className="nav-item">
              <button className="nav-link active">
                <i className="fas fa-chart-pie me-2"></i>Tổng quan
              </button>
            </li>
            <li className="nav-item">
              <button className="nav-link">
                <i className="fas fa-calendar-alt me-2"></i>Kế hoạch
              </button>
            </li>
            <li className="nav-item">
              <button className="nav-link">
                <i className="fas fa-history me-2"></i>Nhật ký
              </button>
            </li>
            <li className="nav-item">
              <button className="nav-link">
                <i className="fas fa-award me-2"></i>Thành tích
              </button>
            </li>
          </ul>
          <div className="p-4">
            {/* Stats */}
            <div className="row g-4 mb-4">
              <div className="col-md-3">
                <div className="bg-primary bg-opacity-10 p-3 rounded-3 shadow-sm d-flex align-items-center">
                  <div className="bg-primary bg-opacity-25 rounded-circle p-3 text-primary">
                    <i className="fas fa-calendar-check"></i>
                  </div>
                  <div className="ms-3">
                    <div className="small text-secondary">Số ngày không hút</div>
                    <div className="h4 fw-bold text-primary mb-0">34 ngày</div>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="bg-success bg-opacity-10 p-3 rounded-3 shadow-sm d-flex align-items-center">
                  <div className="bg-success bg-opacity-25 rounded-circle p-3 text-success">
                    <i className="fas fa-wallet"></i>
                  </div>
                  <div className="ms-3">
                    <div className="small text-secondary">Tiền tiết kiệm</div>
                    <div className="h4 fw-bold text-success mb-0">2,380,000đ</div>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="bg-info bg-opacity-10 p-3 rounded-3 shadow-sm d-flex align-items-center">
                  <div className="bg-info bg-opacity-25 rounded-circle p-3 text-info">
                    <i className="fas fa-smoking-ban"></i>
                  </div>
                  <div className="ms-3">
                    <div className="small text-secondary">Điếu thuốc tránh được</div>
                    <div className="h4 fw-bold text-info mb-0">476 điếu</div>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="bg-danger bg-opacity-10 p-3 rounded-3 shadow-sm d-flex align-items-center">
                  <div className="bg-danger bg-opacity-25 rounded-circle p-3 text-danger">
                    <i className="fas fa-heartbeat"></i>
                  </div>
                  <div className="ms-3">
                    <div className="small text-secondary">Cải thiện sức khỏe</div>
                    <div className="h4 fw-bold text-danger mb-0">47%</div>
                  </div>
                </div>
              </div>
            </div>
            {/* Progress & Goal */}
            <div className="row g-4">
              <div className="col-md-8">
                <div className="bg-white p-4 rounded-3 shadow-sm border mb-4 mb-md-0">
                  <h3 className="fs-5 fw-semibold mb-3">Tiến trình cai thuốc</h3>
                  <div className="d-flex align-items-center justify-content-center" style={{height: "250px", background: "#f5f6fa", borderRadius: "1rem"}}>
                    <span className="text-secondary">Biểu đồ tiến trình sẽ hiển thị tại đây</span>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="bg-white p-4 rounded-3 shadow-sm border text-center">
                  <h3 className="fs-5 fw-semibold mb-3">Mục tiêu hiện tại</h3>
                  <div className="position-relative mx-auto mb-3" style={{width: "160px", height: "160px"}}>
                    <svg width="160" height="160" viewBox="0 0 100 100">
                      <circle stroke="#e9ecef" strokeWidth="10" fill="transparent" r="40" cx="50" cy="50" />
                      <circle stroke="#0d6efd" strokeWidth="10" strokeLinecap="round" fill="transparent" r="40" cx="50" cy="50" strokeDasharray="251.2" strokeDashoffset="100.48" />
                    </svg>
                    <div className="position-absolute top-50 start-50 translate-middle">
                      <span className="h3 fw-bold text-primary">60%</span>
                    </div>
                  </div>
                  <p className="text-secondary">Bạn đã hoàn thành 60% mục tiêu 60 ngày không thuốc lá</p>
                  <button className="btn btn-primary mt-3">Cập nhật tiến trình</button>
                </div>
              </div>
            </div>
            {/* Recent Achievements */}
            <div className="mt-5">
              <h3 className="fs-5 fw-semibold mb-3">Thành tích gần đây</h3>
              <div className="row g-3">
                <div className="col-6 col-sm-4 col-md-2">
                  <div className="bg-warning bg-opacity-10 p-3 rounded-3 shadow-sm text-center">
                    <div className="bg-warning bg-opacity-25 rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2" style={{width: "48px", height: "48px"}}>
                      <i className="fas fa-trophy text-warning fs-4"></i>
                    </div>
                    <div className="small fw-medium">1 tuần không hút</div>
                  </div>
                </div>
                <div className="col-6 col-sm-4 col-md-2">
                  <div className="bg-info bg-opacity-10 p-3 rounded-3 shadow-sm text-center">
                    <div className="bg-info bg-opacity-25 rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2" style={{width: "48px", height: "48px"}}>
                      <i className="fas fa-piggy-bank text-info fs-4"></i>
                    </div>
                    <div className="small fw-medium">Tiết kiệm 500K</div>
                  </div>
                </div>
                <div className="col-6 col-sm-4 col-md-2">
                  <div className="bg-success bg-opacity-10 p-3 rounded-3 shadow-sm text-center">
                    <div className="bg-success bg-opacity-25 rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2" style={{width: "48px", height: "48px"}}>
                      <i className="fas fa-medal text-success fs-4"></i>
                    </div>
                    <div className="small fw-medium">Tăng cường sức khỏe</div>
                  </div>
                </div>
                <div className="col-6 col-sm-4 col-md-2">
                  <div className="bg-primary bg-opacity-10 p-3 rounded-3 shadow-sm text-center">
                    <div className="bg-primary bg-opacity-25 rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2" style={{width: "48px", height: "48px"}}>
                      <i className="fas fa-heart text-primary fs-4"></i>
                    </div>
                    <div className="small fw-medium">Huyết áp ổn định</div>
                  </div>
                </div>
                <div className="col-6 col-sm-4 col-md-2">
                  <div className="bg-danger bg-opacity-10 p-3 rounded-3 shadow-sm text-center">
                    <div className="bg-danger bg-opacity-25 rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2" style={{width: "48px", height: "48px"}}>
                      <i className="fas fa-fire text-danger fs-4"></i>
                    </div>
                    <div className="small fw-medium">Vượt cơn thèm 10 lần</div>
                  </div>
                </div>
              </div>
            </div>
            {/* Motivation */}
            <div className="mt-5 bg-light p-4 rounded-3 shadow-sm">
              <div className="d-flex align-items-start">
                <div className="bg-primary rounded-circle p-3 text-white me-3 d-flex align-items-center justify-content-center" style={{width: "48px", height: "48px"}}>
                  <i className="fas fa-lightbulb fs-4"></i>
                </div>
                <div>
                  <h3 className="fs-5 fw-semibold mb-2">Thông điệp động viên</h3>
                  <p className="mb-1 text-secondary">Hôm nay là ngày thứ 34 không hút thuốc của bạn! Hãy nhớ rằng mỗi ngày không thuốc lá là một chiến thắng. Bạn đã tiết kiệm được 2,380,000đ và tránh được 476 điếu thuốc.</p>
                  <p className="mb-0 text-secondary">Tiếp tục phát huy! Sức khỏe của bạn đã cải thiện đáng kể sau khi bỏ thuốc.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;