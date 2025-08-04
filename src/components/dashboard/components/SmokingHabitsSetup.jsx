import React, { useState } from "react";
import { toast } from "react-toastify";
import api from "../../../api/axios";
import "../../../css/SmokingHabits.css";

const SmokingHabitsSetup = ({ onComplete, memberProfile }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Basic smoking info
    smokingStatus: "Đang hút",
    cigarettesSmoked: 10,
    yearsOfSmoking: 5,
    pricePerPack: 25000,
    cigarettesPerPack: 20, // Default value, hidden from user
    smokingPattern: "",
    
    // Quit history
    quitAttempts: 0,
    previousAttempts: "",
    experienceLevel: 0,
    
    // Health info
    health: "",
    
    // Triggers and motivation
    smokingTriggers: "",
    personalMotivation: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      const submitData = {
        ...formData,
        cigarettesSmoked: parseInt(formData.cigarettesSmoked) || 0,
        yearsOfSmoking: parseInt(formData.yearsOfSmoking) || 0,
        pricePerPack: parseInt(formData.pricePerPack) || 25000,
        cigarettesPerPack: parseInt(formData.cigarettesPerPack) || 20,
        quitAttempts: parseInt(formData.quitAttempts) || 0,
        experienceLevel: parseInt(formData.experienceLevel) || 0,
      };

      if (memberProfile?.memberId) {
        // Update existing profile
        await api.put(`/MemberProfile/${memberProfile.memberId}`, {
          memberId: memberProfile.memberId,
          ...submitData
        });
      } else {
        // Create new profile
        await api.post("/MemberProfile", submitData);
      }

      toast.success("Đã lưu thông tin thành công!");
      onComplete();
    } catch (error) {
      console.error("Error saving smoking habits:", error);
      toast.error("Lưu thông tin thất bại!");
    }
  };

  const nextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="step-content">
            <div className="step-header mb-4">
              <div className="step-icon">
                <i className="fas fa-smoking"></i>
              </div>
              <div className="step-info">
                <h4 className="step-title">
                  Thói quen hút thuốc hiện tại
                </h4>
                <p className="step-description">
                  Hãy chia sẻ về thói quen hút thuốc của bạn để chúng tôi có thể tư vấn tốt nhất
                </p>
              </div>
            </div>
            
            <div className="row g-4">
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    <i className="fas fa-calendar-day me-1" />
                    Số điếu thuốc mỗi ngày *
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    name="cigarettesSmoked"
                    value={formData.cigarettesSmoked}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    required
                  />
                  <small className="form-text text-muted">
                    Trung bình số điếu bạn hút mỗi ngày
                  </small>
                </div>
              </div>

              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    <i className="fas fa-clock me-1" />
                    Số năm hút thuốc *
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    name="yearsOfSmoking"
                    value={formData.yearsOfSmoking}
                    onChange={handleChange}
                    min="0"
                    max="100"
                    required
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    <i className="fas fa-money-bill me-1" />
                    Giá tiền 1 gói thuốc (VND) *
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    name="pricePerPack"
                    value={formData.pricePerPack}
                    onChange={handleChange}
                    min="1000"
                    step="1000"
                    required
                  />
                  <small className="form-text text-muted">
                    Giả định 1 gói có 20 điếu thuốc
                  </small>
                </div>
              </div>

              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    <i className="fas fa-clock me-1" />
                    Thói quen hút thuốc
                  </label>
                  <select
                    className="form-select"
                    name="smokingPattern"
                    value={formData.smokingPattern}
                    onChange={handleChange}
                  >
                    <option value="">Chọn thói quen</option>
                    <option value="Sáng sớm">Sáng sớm</option>
                    <option value="Sau bữa ăn">Sau bữa ăn</option>
                    <option value="Khi căng thẳng">Khi căng thẳng</option>
                    <option value="Buổi tối">Buổi tối</option>
                    <option value="Cả ngày">Cả ngày</option>
                    <option value="Cuối tuần">Chỉ cuối tuần</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="step-content">
            <div className="step-header mb-4">
              <div className="step-icon">
                <i className="fas fa-history"></i>
              </div>
              <div className="step-info">
                <h4 className="step-title">
                  Lịch sử cai thuốc & Sức khỏe
                </h4>
                <p className="step-description">
                  Chia sẻ kinh nghiệm cai thuốc trước đây và tình trạng sức khỏe hiện tại
                </p>
              </div>
            </div>
            
            <div className="row g-4">
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    <i className="fas fa-redo me-1" />
                    Số lần cai thuốc trước đây
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    name="quitAttempts"
                    value={formData.quitAttempts}
                    onChange={handleChange}
                    min="0"
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    <i className="fas fa-chart-line me-1" />
                    Mức độ kinh nghiệm cai thuốc
                  </label>
                  <select
                    className="form-select"
                    name="experienceLevel"
                    value={formData.experienceLevel}
                    onChange={handleChange}
                  >
                    <option value="0">Người mới bắt đầu</option>
                    <option value="1">Có chút kinh nghiệm</option>
                    <option value="2">Có kinh nghiệm</option>
                    <option value="3">Rất có kinh nghiệm</option>
                  </select>
                </div>
              </div>

              <div className="col-12">
                <div className="mb-3">
                  <label className="form-label">
                    <i className="fas fa-clipboard-list me-1" />
                    Mô tả chi tiết lịch sử cai thuốc
                  </label>
                  <textarea
                    className="form-control"
                    name="previousAttempts"
                    value={formData.previousAttempts}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Mô tả các lần cai thuốc trước đây, nguyên nhân thất bại, bài học kinh nghiệm..."
                  />
                </div>
              </div>

              <div className="col-12">
                <div className="mb-3">
                  <label className="form-label">
                    <i className="fas fa-exclamation-triangle me-1" />
                    Tình huống kích thích hút thuốc
                  </label>
                  <textarea
                    className="form-control"
                    name="smokingTriggers"
                    value={formData.smokingTriggers}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Ví dụ: căng thẳng, uống cà phê, gặp bạn bè, sau bữa ăn, khi buồn chán..."
                  />
                </div>
              </div>

              <div className="col-12">
                <div className="mb-3">
                  <label className="form-label">
                    <i className="fas fa-stethoscope me-1" />
                    Tình trạng sức khỏe hiện tại
                  </label>
                  <textarea
                    className="form-control"
                    name="health"
                    value={formData.health}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Mô tả tình trạng sức khỏe hiện tại của bạn..."
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="step-content">
            <div className="step-header mb-4">
              <div className="step-icon">
                <i className="fas fa-bullseye"></i>
              </div>
              <div className="step-info">
                <h4 className="step-title">
                  Động lực và mục tiêu
                </h4>
                <p className="step-description">
                  Xác định động lực cá nhân để có hành trình cai thuốc thành công
                </p>
              </div>
            </div>
            
            <div className="row g-4">
              <div className="col-12">
                <div className="mb-3">
                  <label className="form-label">
                    <i className="fas fa-heart me-1" />
                    Động lực cá nhân cai thuốc *
                  </label>
                  <textarea
                    className="form-control"
                    name="personalMotivation"
                    value={formData.personalMotivation}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Vì sao bạn muốn cai thuốc? (Ví dụ: vì sức khỏe, gia đình, tiền bạc, hình ảnh cá nhân...)"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="mt-4 bg-light">
              <h5 className="mb-3">
                <i className="fas fa-clipboard-check me-2" />
                Tóm tắt thông tin
              </h5>
              <div className="row">
                <div className="col-md-6">
                  <ul className="list-unstyled">
                    <li><strong>Số điếu/ngày:</strong> {formData.cigarettesSmoked}</li>
                    <li><strong>Số năm hút:</strong> {formData.yearsOfSmoking}</li>
                    <li><strong>Giá 1 gói:</strong> {parseInt(formData.pricePerPack).toLocaleString('vi-VN')} VND</li>
                    <li><strong>Số lần cai:</strong> {formData.quitAttempts}</li>
                  </ul>
                </div>
                <div className="col-md-6">
                  <div className="cost-estimate">
                    <h6>Ước tính chi phí hàng tháng</h6>
                    <p className="h5">
                      {Math.round((formData.cigarettesSmoked / formData.cigarettesPerPack) * formData.pricePerPack * 30).toLocaleString('vi-VN')} VND
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="smoking-habits-setup">
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card shadow">
              <div className="card-header bg-primary text-white">
                <div className="d-flex justify-content-between align-items-center">
                  <h3 className="mb-0">
                    <i className="fas fa-user-plus me-2" />
                    Thiết lập hồ sơ cai thuốc
                  </h3>
                  <span className="badge bg-white text-primary">
                    Bước {step}/3
                  </span>
                </div>
                
                {/* Progress bar */}
                <div className="mt-3">
                  <div className="progress" style={{ height: '6px' }}>
                    <div 
                      className="progress-bar bg-warning" 
                      style={{ width: `${(step / 3) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="card-body p-4">
                {renderStep()}
              </div>

              <div className="card-footer bg-light">
                <div className="d-flex justify-content-between">
                  <button 
                    className="btn btn-outline-secondary"
                    onClick={prevStep}
                    disabled={step === 1}
                  >
                    <i className="fas fa-arrow-left me-1" />
                    Quay lại
                  </button>

                  <div>
                    {step < 3 ? (
                      <button 
                        className="btn btn-primary"
                        onClick={nextStep}
                      >
                        Tiếp theo
                        <i className="fas fa-arrow-right ms-1" />
                      </button>
                    ) : (
                      <button 
                        className="btn btn-success"
                        onClick={handleSubmit}
                      >
                        <i className="fas fa-save me-1" />
                        Hoàn thành
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmokingHabitsSetup;
