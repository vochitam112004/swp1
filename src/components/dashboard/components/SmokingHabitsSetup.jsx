import React, { useState } from "react";
import { toast } from "react-toastify";
import api from "../../../api/axios";
import "../../../css/SmokingHabits.css";

const SmokingHabitsSetup = ({ onComplete, memberProfile }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Basic smoking info
    smokingStatus: "Đang hút",
    dailyCigarettes: 10,
    yearsOfSmoking: 5,
    packPrice: 25000,
    cigarettesPerPack: 20,
    preferredBrand: "",
    smokingPattern: "",
    
    // Quit history
    quitAttempts: 0,
    previousAttempts: "",
    experienceLevel: 0,
    
    // Health info
    healthConditions: "",
    allergies: "",
    medications: "",
    previousHealthIssues: "",
    
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
        dailyCigarettes: parseInt(formData.dailyCigarettes) || 0,
        yearsOfSmoking: parseInt(formData.yearsOfSmoking) || 0,
        packPrice: parseInt(formData.packPrice) || 25000,
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
    if (step < 4) {
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
            <h4 className="mb-4">
              <i className="fas fa-smoking me-2 text-danger" />
              Thói quen hút thuốc hiện tại
            </h4>
            
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    <i className="fas fa-calendar-day me-1" />
                    Số điếu thuốc mỗi ngày *
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    name="dailyCigarettes"
                    value={formData.dailyCigarettes}
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
                    <i className="fas fa-box me-1" />
                    Số điếu thuốc trong 1 gói
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    name="cigarettesPerPack"
                    value={formData.cigarettesPerPack}
                    onChange={handleChange}
                    min="1"
                    max="50"
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
                    name="packPrice"
                    value={formData.packPrice}
                    onChange={handleChange}
                    min="1000"
                    step="1000"
                    required
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    <i className="fas fa-tag me-1" />
                    Thương hiệu thuốc ưa thích
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="preferredBrand"
                    value={formData.preferredBrand}
                    onChange={handleChange}
                    placeholder="Ví dụ: Marlboro, Lucky Strike..."
                  />
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
            <h4 className="mb-4">
              <i className="fas fa-history me-2 text-warning" />
              Lịch sử cai thuốc
            </h4>
            
            <div className="row">
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
                    rows="4"
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
            </div>
          </div>
        );

      case 3:
        return (
          <div className="step-content">
            <h4 className="mb-4">
              <i className="fas fa-heartbeat me-2 text-success" />
              Thông tin sức khỏe
            </h4>
            
            <div className="row">
              <div className="col-12">
                <div className="mb-3">
                  <label className="form-label">
                    <i className="fas fa-stethoscope me-1" />
                    Tình trạng sức khỏe hiện tại
                  </label>
                  <textarea
                    className="form-control"
                    name="healthConditions"
                    value={formData.healthConditions}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Mô tả tình trạng sức khỏe hiện tại của bạn..."
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    <i className="fas fa-allergies me-1" />
                    Dị ứng
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="allergies"
                    value={formData.allergies}
                    onChange={handleChange}
                    placeholder="Dị ứng thuốc, thực phẩm..."
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    <i className="fas fa-pills me-1" />
                    Thuốc đang sử dụng
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="medications"
                    value={formData.medications}
                    onChange={handleChange}
                    placeholder="Thuốc đang điều trị..."
                  />
                </div>
              </div>

              <div className="col-12">
                <div className="mb-3">
                  <label className="form-label">
                    <i className="fas fa-clipboard-list me-1" />
                    Vấn đề sức khỏe do hút thuốc
                  </label>
                  <textarea
                    className="form-control"
                    name="previousHealthIssues"
                    value={formData.previousHealthIssues}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Các vấn đề sức khỏe đã gặp do hút thuốc (ho, khó thở, đau ngực...)..."
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="step-content">
            <h4 className="mb-4">
              <i className="fas fa-bullseye me-2 text-info" />
              Động lực và mục tiêu
            </h4>
            
            <div className="row">
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

              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">
                    <i className="fas fa-info-circle me-1" />
                    Tình trạng hiện tại
                  </label>
                  <select
                    className="form-select"
                    name="smokingStatus"
                    value={formData.smokingStatus}
                    onChange={handleChange}
                  >
                    <option value="Đang hút">Đang hút</option>
                    <option value="Đang cai">Đang cai</option>
                    <option value="Đã cai">Đã cai</option>
                    <option value="Thỉnh thoảng">Thỉnh thoảng</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="mt-4 p-4 bg-light rounded">
              <h5 className="mb-3">
                <i className="fas fa-clipboard-check me-2" />
                Tóm tắt thông tin
              </h5>
              <div className="row">
                <div className="col-md-6">
                  <ul className="list-unstyled">
                    <li><strong>Số điếu/ngày:</strong> {formData.dailyCigarettes}</li>
                    <li><strong>Số năm hút:</strong> {formData.yearsOfSmoking}</li>
                    <li><strong>Giá 1 gói:</strong> {parseInt(formData.packPrice).toLocaleString('vi-VN')} VND</li>
                    <li><strong>Số lần cai:</strong> {formData.quitAttempts}</li>
                  </ul>
                </div>
                <div className="col-md-6">
                  <p><strong>Ước tính chi phí hàng tháng:</strong></p>
                  <p className="text-danger h5">
                    {Math.round((formData.dailyCigarettes / formData.cigarettesPerPack) * formData.packPrice * 30).toLocaleString('vi-VN')} VND
                  </p>
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
                    Bước {step}/4
                  </span>
                </div>
                
                {/* Progress bar */}
                <div className="mt-3">
                  <div className="progress" style={{ height: '6px' }}>
                    <div 
                      className="progress-bar bg-warning" 
                      style={{ width: `${(step / 4) * 100}%` }}
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
                    {step < 4 ? (
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
