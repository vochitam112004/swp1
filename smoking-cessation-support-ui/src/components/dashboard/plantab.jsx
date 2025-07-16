import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const samplePlan = {
  reason: 'Bảo vệ sức khỏe, tiết kiệm chi phí, làm gương cho con cái',
  stages: '1. Giảm dần số lượng thuốc mỗi ngày\n2. Đặt ngày cai hoàn toàn\n3. Theo dõi và nhận hỗ trợ khi cần',
  startDate: '2025-07-01',
  expectedDate: '2025-08-01',
  support: 'Gia đình, bạn bè, chuyên gia tư vấn',
  goalDays: 30
};

const PlanTab = ({ plan, progress, onUpdatePlan }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [planStatus, setPlanStatus] = useState(""); 
  const [formData, setFormData] = useState(() => {
    // Khởi tạo formData từ localStorage hoặc giá trị mặc định
    const savedFormData = localStorage.getItem('planTabFormData');
    if (savedFormData) {
      try {
        return JSON.parse(savedFormData);
      } catch (e) {
        console.error('Error parsing saved form data:', e);
      }
    }
    return {
      reason: '',
      stages: '',
      startDate: '',
      expectedDate: '',
      support: '',
      goalDays: 30
    };
  });

  // Lấy kế hoạch và tiến trình từ API khi load
  // Cập nhật trạng thái kế hoạch
  useEffect(() => {
    if (!plan || !progress) {
      setPlanStatus("Bạn chưa tạo kế hoạch cai thuốc.");
      return;
    }
    
    const daysNoSmoke = progress.daysNoSmoke || 0;
    const goalDays = plan.goalDays || 60;
    
    if (daysNoSmoke >= goalDays) {
      setPlanStatus("🎉 Hoàn thành kế hoạch cai thuốc!");
    } else {
      setPlanStatus(`📈 Đã không hút thuốc ${daysNoSmoke}/${goalDays} ngày (${Math.round((daysNoSmoke/goalDays)*100)}%)`);
    }
  }, [plan, progress]);

  // Load dữ liệu kế hoạch hiện tại vào form
  useEffect(() => {
    if (plan) {
      const newFormData = {
        reason: plan.reason || '',
        stages: plan.stages || '',
        startDate: plan.startDate ? plan.startDate.split('T')[0] : '',
        expectedDate: plan.expectedDate ? plan.expectedDate.split('T')[0] : '',
        support: plan.support || '',
        goalDays: plan.goalDays || 30
      };
      setFormData(newFormData);
      // Lưu vào localStorage
      localStorage.setItem('planTabFormData', JSON.stringify(newFormData));
    }
  }, [plan]);

  // Lưu formData vào localStorage mỗi khi có thay đổi
  useEffect(() => {
    localStorage.setItem('planTabFormData', JSON.stringify(formData));
  }, [formData]);

  const handleSuggestPlan = () => {
    const suggestedData = { ...samplePlan };
    setFormData(suggestedData);
    localStorage.setItem('planTabFormData', JSON.stringify(suggestedData));
    setModalVisible(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra ngày kết thúc
    if (!formData.expectedDate) {
      toast.error("Xin hãy nhập ngày kết thúc");
      return;
    }

    try {
      let newPlan;
      if (!plan) {
        // Ngày bắt đầu tự động lấy ngày hiện tại
        newPlan = {
          goalDays: parseInt(formData.goalDays),
          reason: formData.reason,
          reminderFrequency: 'daily',
          stages: formData.stages,
          support: formData.support,
          startDate: new Date().toISOString().split('T')[0], // Ngày hiện tại
          expectedDate: formData.expectedDate
        };
      } else {
        // Nếu đã có kế hoạch, truyền cả hai ngày
        newPlan = {
          goalDays: parseInt(formData.goalDays),
          reason: formData.reason,
          reminderFrequency: 'daily',
          stages: formData.stages,
          support: formData.support,
          startDate: formData.startDate,
          expectedDate: formData.expectedDate
        };
      }

      await onUpdatePlan(newPlan);

      toast.success("Đã lưu kế hoạch chi tiết!");
    } catch (error) {
      toast.error("Lưu kế hoạch thất bại!");
      console.error(error);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const acceptSuggestedPlan = () => {
    setModalVisible(false);
    // Dữ liệu đã được set trong handleSuggestPlan và lưu vào localStorage
    localStorage.setItem('planTabFormData', JSON.stringify(formData));
  };

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h3 className="fs-5 fw-semibold mb-0">
          <i className="fas fa-calendar-alt me-2 text-primary"></i>
          Lộ trình kế hoạch cai thuốc
        </h3>
        <button 
          className="btn btn-outline-info btn-sm"
          onClick={handleSuggestPlan}
        >
          <i className="fas fa-lightbulb me-1"></i>
          Gợi ý kế hoạch
        </button>
      </div>

      {/* Trạng thái hiện tại */}
      <div className="alert alert-info mb-4">
        <div className="d-flex align-items-center">
          <i className="fas fa-chart-line me-2 fs-4"></i>
          <div>
            <strong>Trạng thái hiện tại:</strong>
            <div className="mt-1">{planStatus}</div>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      {plan && progress && (
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="small text-muted">Tiến độ hoàn thành</span>
            <span className="small fw-bold">
              {Math.round(((progress.daysNoSmoke || 0) / (plan.goalDays || 60)) * 100)}%
            </span>
          </div>
          <div className="progress" style={{ height: '8px' }}>
            <div 
              className="progress-bar bg-success" 
              style={{ width: `${Math.min(((progress.daysNoSmoke || 0) / (plan.goalDays || 60)) * 100, 100)}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Form chi tiết kế hoạch */}
      <div className="card">
        <div className="card-header bg-light">
          <h5 className="card-title mb-0">
            <i className="fas fa-edit me-2"></i>
            Chi tiết kế hoạch cai thuốc
          </h5>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    <i className="fas fa-heart me-1 text-danger"></i>
                    Lý do cai thuốc *
                  </label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={formData.reason}
                    onChange={(e) => handleInputChange('reason', e.target.value)}
                    placeholder="Nhập lý do bạn muốn cai thuốc..."
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    <i className="fas fa-list-ol me-1 text-info"></i>
                    Các giai đoạn thực hiện *
                  </label>
                  <textarea
                    className="form-control"
                    rows={4}
                    value={formData.stages}
                    onChange={(e) => handleInputChange('stages', e.target.value)}
                    placeholder="Nhập các giai đoạn dự kiến..."
                    required
                  />
                  <div className="form-text">
                    Ví dụ: 1. Giảm dần số lượng thuốc<br/>2. Đặt ngày cai hoàn toàn<br/>3. Theo dõi và duy trì
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    <i className="fas fa-users me-1 text-success"></i>
                    Nguồn hỗ trợ
                  </label>
                  <textarea
                    className="form-control"
                    rows={2}
                    value={formData.support}
                    onChange={(e) => handleInputChange('support', e.target.value)}
                    placeholder="Gia đình, bạn bè, chuyên gia tư vấn..."
                  />
                </div>
              </div>

              <div className="col-md-6">
                {/* Chỉ hiển thị trường ngày bắt đầu nếu đã có kế hoạch */}
                {plan && (
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      <i className="fas fa-calendar-plus me-1 text-primary"></i>
                      Ngày bắt đầu *
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      value={formData.startDate}
                      readOnly
                      style={{ backgroundColor: "#f5f5f5" }}
                    />
                  </div>
                )}

                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    <i className="fas fa-calendar-check me-1 text-success"></i>
                    Ngày dự kiến hoàn thành *
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    value={formData.expectedDate}
                    onChange={(e) => handleInputChange('expectedDate', e.target.value)}
                    required
                  />
                  {!formData.expectedDate && (
                    <div className="text-danger mt-1">Xin hãy nhập ngày kết thúc</div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    <i className="fas fa-target me-1 text-warning"></i>
                    Số ngày mục tiêu không hút thuốc *
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    min="1"
                    max="365"
                    value={formData.goalDays}
                    onChange={(e) => handleInputChange('goalDays', e.target.value)}
                    required
                  />
                  <div className="form-text">
                    Đề xuất: 30-90 ngày cho người mới bắt đầu
                  </div>
                </div>
              </div>
            </div>

            <div className="d-flex gap-2 mt-4">
              <button type="submit" className="btn btn-primary">
                <i className="fas fa-save me-2"></i>
                Lưu kế hoạch chi tiết
              </button>
              <button 
                type="button" 
                className="btn btn-outline-secondary"
                onClick={handleSuggestPlan}
              >
                <i className="fas fa-magic me-2"></i>
                Sử dụng mẫu có sẵn
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Hiển thị kế hoạch hiện tại */}
      {plan && (
        <div className="card mt-4">
          <div className="card-header bg-success text-white">
            <h5 className="card-title mb-0">
              <i className="fas fa-clipboard-check me-2"></i>
              Kế hoạch hiện tại
            </h5>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <p><strong>Mục tiêu:</strong> {plan.goalDays || 60} ngày không hút thuốc</p>
                <p><strong>Lý do:</strong> {plan.reason || "Vì sức khỏe và tương lai tốt đẹp"}</p>
                <p><strong>Tần suất nhắc nhở:</strong> {plan.reminderFrequency || "Hàng ngày"}</p>
              </div>
              <div className="col-md-6">
                {/* Luôn hiển thị ngày dự kiến hoàn thành */}
                <p><strong>Ngày dự kiến:</strong> {plan.expectedDate ? new Date(plan.expectedDate).toLocaleDateString('vi-VN') : "Chưa xác định"}</p>
                <p><strong>Áp dụng cho:</strong> Tất cả thành viên cộng đồng</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal gợi ý kế hoạch */}
      {modalVisible && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-lightbulb me-2 text-warning"></i>
                  Gợi ý kế hoạch mẫu
                </h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setModalVisible(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="alert alert-info">
                  <i className="fas fa-info-circle me-2"></i>
                  Đây là kế hoạch mẫu được thiết kế dựa trên kinh nghiệm thành công của nhiều người đã cai thuốc.
                </div>
                
                <div className="row">
                  <div className="col-md-6">
                    <h6><i className="fas fa-heart me-1 text-danger"></i> Lý do:</h6>
                    <p className="text-muted">{samplePlan.reason}</p>
                    
                    <h6><i className="fas fa-calendar me-1 text-primary"></i> Thời gian:</h6>
                    <p className="text-muted">
                      <strong>Bắt đầu:</strong> {samplePlan.startDate}<br/>
                      <strong>Dự kiến:</strong> {samplePlan.expectedDate}<br/>
                      <strong>Mục tiêu:</strong> {samplePlan.goalDays} ngày
                    </p>
                  </div>
                  
                  <div className="col-md-6">
                    <h6><i className="fas fa-list-ol me-1 text-info"></i> Các giai đoạn:</h6>
                    <div className="text-muted" style={{ whiteSpace: 'pre-line' }}>
                      {samplePlan.stages}
                    </div>
                    
                    <h6 className="mt-3"><i className="fas fa-users me-1 text-success"></i> Hỗ trợ:</h6>
                    <p className="text-muted">{samplePlan.support}</p>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setModalVisible(false)}
                >
                  Đóng
                </button>
                <button 
                  type="button" 
                  className="btn btn-primary"
                  onClick={acceptSuggestedPlan}
                >
                  <i className="fas fa-check me-2"></i>
                  Sử dụng kế hoạch này
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanTab;