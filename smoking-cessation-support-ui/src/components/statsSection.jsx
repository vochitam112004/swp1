const StatsSection = () => (
  <div className="bg-white py-5">
    <div className="container">
      <div className="text-center mb-5">
        <h2 className="text-primary text-uppercase fw-semibold fs-6">
          Thành tựu của cộng đồng
        </h2>
        <p className="mt-2 display-6 fw-bold text-dark">
          Chúng tôi đã giúp hàng ngàn người từ bỏ thuốc lá
        </p>
      </div>
      <div className="row g-4">
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="bg-light p-4 rounded-3 shadow-sm h-100 d-flex align-items-center">
            <div
              className="bg-primary rounded-3 d-flex align-items-center justify-content-center me-3"
              style={{ width: 48, height: 48 }}
            >
              <i className="fas fa-calendar-check text-white fs-3"></i>
            </div>
            <div>
              <div className="fw-semibold text-dark">
                Số ngày không thuốc lá
              </div>
              <div className="h3 fw-bold text-primary mb-0">
                12,586,432+
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="bg-light p-4 rounded-3 shadow-sm h-100 d-flex align-items-center">
            <div
              className="bg-success rounded-3 d-flex align-items-center justify-content-center me-3"
              style={{ width: 48, height: 48 }}
            >
              <i className="fas fa-wallet text-white fs-3"></i>
            </div>
            <div>
              <div className="fw-semibold text-dark">Tiền tiết kiệm</div>
              <div className="h3 fw-bold text-success mb-0">
                1,245 tỷ VNĐ
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="bg-light p-4 rounded-3 shadow-sm h-100 d-flex align-items-center">
            <div
              className="bg-info rounded-3 d-flex align-items-center justify-content-center me-3"
              style={{ width: 48, height: 48 }}
            >
              <i className="fas fa-users text-white fs-3"></i>
            </div>
            <div>
              <div className="fw-semibold text-dark">Thành viên tích cực</div>
              <div className="h3 fw-bold text-info mb-0">15,324+</div>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="bg-light p-4 rounded-3 shadow-sm h-100 d-flex align-items-center">
            <div
              className="bg-warning rounded-3 d-flex align-items-center justify-content-center me-3"
              style={{ width: 48, height: 48 }}
            >
              <i className="fas fa-trophy text-white fs-3"></i>
            </div>
            <div>
              <div className="fw-semibold text-dark">Người cai thành công</div>
              <div className="h3 fw-bold text-warning mb-0">8,764+</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default StatsSection;