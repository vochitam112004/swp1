// Profile management component
import React, { useState } from "react";
import { toast } from "react-toastify";
import api from "../../../api/axios";
import "../../../css/SmokingHabits.css";

const ProfileManager = ({
  memberProfile,
  setMemberProfile,
  smokingStatus,
  setSmokingStatus,
  quitAttempts,
  setQuitAttempts,
  experienceLevel,
  setExperienceLevel,
  previousAttempts,
  setPreviousAttempts,
  fetchProfile
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    smokingStatus: smokingStatus,
    quitAttempts: quitAttempts,
    experienceLevel: experienceLevel,
    previousAttempts: previousAttempts,
    // Smoking habits details
    cigarettesSmoked: memberProfile?.cigarettesSmoked || 0,
    yearsOfSmoking: memberProfile?.yearsOfSmoking || 0,
    pricePerPack: memberProfile?.pricePerPack || 25000,
    cigarettesPerPack: memberProfile?.cigarettesPerPack || 20,
    // Health information - simplified according to API
    health: memberProfile?.health || '',
    // Additional smoking details
    smokingTriggers: memberProfile?.smokingTriggers || '',
    smokingPattern: memberProfile?.smokingPattern || '',
  });

  // Xử lý thay đổi form
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Xử lý cập nhật hồ sơ
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    if (!memberProfile?.memberId) {
      toast.error("Không tìm thấy thông tin hồ sơ!");
      return;
    }

    try {
      const updateData = {
        cigarettesSmoked: parseInt(formData.cigarettesSmoked) || 0,
        quitAttempts: parseInt(formData.quitAttempts) || 0,
        experienceLevel: parseInt(formData.experienceLevel) || 0,
        personalMotivation: formData.personalMotivation || '',
        health: formData.health || '',
        pricePerPack: parseInt(formData.pricePerPack) || 25000,
        cigarettesPerPack: parseInt(formData.cigarettesPerPack) || 20,
        updatedAt: new Date().toISOString()
      };

      const response = await api.put('/api/MemberProfile/UpdateMyMemberProfile', updateData);
      
      // Cập nhật state
      setQuitAttempts(parseInt(formData.quitAttempts) || 0);
      setExperienceLevel(parseInt(formData.experienceLevel) || 0);
      
      setIsEditing(false);
      toast.success("Đã cập nhật hồ sơ thành công!");
      
      // Refresh profile data
      await fetchProfile();
    } catch (err) {
      console.error("❌ Lỗi cập nhật hồ sơ:", err);
      toast.error(err.response?.data?.message || "Cập nhật hồ sơ thất bại!");
    }
  };

  // Reset form khi hủy
  const handleCancel = () => {
    setFormData({
      smokingStatus: smokingStatus,
      quitAttempts: quitAttempts,
      experienceLevel: experienceLevel,
      previousAttempts: previousAttempts,
      // Reset smoking habits details
      cigarettesSmoked: memberProfile?.cigarettesSmoked || 0,
      yearsOfSmoking: memberProfile?.yearsOfSmoking || 0,
      pricePerPack: memberProfile?.pricePerPack || 25000,
      cigarettesPerPack: memberProfile?.cigarettesPerPack || 20,
      // Reset health information - simplified according to API
      health: memberProfile?.health || '',
      // Reset additional smoking details
      smokingTriggers: memberProfile?.smokingTriggers || '',
      smokingPattern: memberProfile?.smokingPattern || '',
    });
    setIsEditing(false);
  };

  return (
    <div className="profile-manager">
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <i className="fas fa-user me-2" />
            Thông tin hồ sơ cá nhân
          </h5>
          {!isEditing && (
            <button 
              className="btn btn-primary btn-sm"
              onClick={() => setIsEditing(true)}
            >
              <i className="fas fa-edit me-1" />
              Chỉnh sửa
            </button>
          )}
        </div>
        <div className="card-body">
          {memberProfile ? (
            <form onSubmit={handleProfileSubmit}>
              <div className="row">
                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">
                      <i className="fas fa-smoking me-1" />
                      Tình trạng hút thuốc
                    </label>
                    {isEditing ? (
                      <select
                        className="form-select"
                        name="smokingStatus"
                        value={formData.smokingStatus}
                        onChange={handleFormChange}
                      >
                        <option value="">Chọn tình trạng</option>
                        <option value="Đang hút">Đang hút</option>
                        <option value="Đang cai">Đang cai</option>
                        <option value="Đã cai">Đã cai</option>
                        <option value="Thỉnh thoảng">Thỉnh thoảng</option>
                      </select>
                    ) : (
                      <div className="form-control-plaintext">
                        <span className={`badge ${
                          smokingStatus === "Đã cai" ? "bg-success" :
                          smokingStatus === "Đang cai" ? "bg-warning" :
                          smokingStatus === "Đang hút" ? "bg-danger" : "bg-secondary"
                        }`}>
                          {smokingStatus || "Chưa cập nhật"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">
                      <i className="fas fa-redo me-1" />
                      Số lần cai thuốc
                    </label>
                    {isEditing ? (
                      <input
                        type="number"
                        className="form-control"
                        name="quitAttempts"
                        value={formData.quitAttempts}
                        onChange={handleFormChange}
                        min="0"
                      />
                    ) : (
                      <div className="form-control-plaintext">
                        <strong>{quitAttempts} lần</strong>
                      </div>
                    )}
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">
                      <i className="fas fa-chart-line me-1" />
                      Mức độ kinh nghiệm
                    </label>
                    {isEditing ? (
                      <select
                        className="form-select"
                        name="experienceLevel"
                        value={formData.experienceLevel}
                        onChange={handleFormChange}
                      >
                        <option value="0">Người mới bắt đầu</option>
                        <option value="1">Có chút kinh nghiệm</option>
                        <option value="2">Có kinh nghiệm</option>
                        <option value="3">Rất có kinh nghiệm</option>
                      </select>
                    ) : (
                      <div className="form-control-plaintext">
                        <span className={`badge ${
                          experienceLevel === 0 ? "bg-info" :
                          experienceLevel === 1 ? "bg-warning" :
                          experienceLevel === 2 ? "bg-primary" : "bg-success"
                        }`}>
                          {experienceLevel === 0 ? "Người mới bắt đầu" :
                           experienceLevel === 1 ? "Có chút kinh nghiệm" :
                           experienceLevel === 2 ? "Có kinh nghiệm" : "Rất có kinh nghiệm"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="col-12">
                  <div className="mb-3">
                    <label className="form-label">
                      <i className="fas fa-history me-1" />
                      Lịch sử cai thuốc trước đây
                    </label>
                    {isEditing ? (
                      <textarea
                        className="form-control"
                        name="previousAttempts"
                        value={formData.previousAttempts}
                        onChange={handleFormChange}
                        rows="3"
                        placeholder="Mô tả các lần cai thuốc trước đây, nguyên nhân thất bại, bài học kinh nghiệm..."
                      />
                    ) : (
                      <div className="form-control-plaintext">
                        {previousAttempts || "Chưa có thông tin"}
                      </div>
                    )}
                  </div>
                </div>

                {/* Smoking Habits Section */}
                <div className="col-12">
                  <hr />
                  <h6 className="text-primary">
                    <i className="fas fa-smoking me-2" />
                    Thói quen hút thuốc
                  </h6>
                </div>

                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">
                      <i className="fas fa-calendar-day me-1" />
                      Số điếu thuốc mỗi ngày
                    </label>
                    {isEditing ? (
                      <input
                        type="number"
                        className="form-control"
                        name="cigarettesSmoked"
                        value={formData.cigarettesSmoked}
                        onChange={handleFormChange}
                        min="0"
                        max="100"
                      />
                    ) : (
                      <div className="form-control-plaintext">
                        <strong>{memberProfile?.cigarettesSmoked || 0} điếu/ngày</strong>
                      </div>
                    )}
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">
                      <i className="fas fa-clock me-1" />
                      Số năm hút thuốc
                    </label>
                    {isEditing ? (
                      <input
                        type="number"
                        className="form-control"
                        name="yearsOfSmoking"
                        value={formData.yearsOfSmoking}
                        onChange={handleFormChange}
                        min="0"
                        max="100"
                      />
                    ) : (
                      <div className="form-control-plaintext">
                        <strong>{memberProfile?.yearsOfSmoking || 0} năm</strong>
                      </div>
                    )}
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">
                      <i className="fas fa-box me-1" />
                      Số điếu thuốc trong 1 gói
                    </label>
                    {isEditing ? (
                      <input
                        type="number"
                        className="form-control"
                        name="cigarettesPerPack"
                        value={formData.cigarettesPerPack}
                        onChange={handleFormChange}
                        min="1"
                        max="50"
                      />
                    ) : (
                      <div className="form-control-plaintext">
                        <strong>{memberProfile?.cigarettesPerPack || 20} điếu/gói</strong>
                      </div>
                    )}
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">
                      <i className="fas fa-money-bill me-1" />
                      Giá tiền 1 gói thuốc (VND)
                    </label>
                    {isEditing ? (
                      <input
                        type="number"
                        className="form-control"
                        name="pricePerPack"
                        value={formData.pricePerPack}
                        onChange={handleFormChange}
                        min="1000"
                        step="1000"
                      />
                    ) : (
                      <div className="form-control-plaintext">
                        <strong>{(memberProfile?.pricePerPack || 25000).toLocaleString('vi-VN')} VND</strong>
                      </div>
                    )}
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="mb-3">
                    <label className="form-label">
                      <i className="fas fa-clock me-1" />
                      Thói quen hút thuốc
                    </label>
                    {isEditing ? (
                      <select
                        className="form-select"
                        name="smokingPattern"
                        value={formData.smokingPattern}
                        onChange={handleFormChange}
                      >
                        <option value="">Chọn thói quen</option>
                        <option value="Sáng sớm">Sáng sớm</option>
                        <option value="Sau bữa ăn">Sau bữa ăn</option>
                        <option value="Khi căng thẳng">Khi căng thẳng</option>
                        <option value="Buổi tối">Buổi tối</option>
                        <option value="Cả ngày">Cả ngày</option>
                        <option value="Cuối tuần">Chỉ cuối tuần</option>
                      </select>
                    ) : (
                      <div className="form-control-plaintext">
                        {memberProfile?.smokingPattern || "Chưa cập nhật"}
                      </div>
                    )}
                  </div>
                </div>

                <div className="col-12">
                  <div className="mb-3">
                    <label className="form-label">
                      <i className="fas fa-exclamation-triangle me-1" />
                      Tình huống kích thích hút thuốc
                    </label>
                    {isEditing ? (
                      <textarea
                        className="form-control"
                        name="smokingTriggers"
                        value={formData.smokingTriggers}
                        onChange={handleFormChange}
                        rows="2"
                        placeholder="Ví dụ: căng thẳng, uống cà phê, gặp bạn bè, sau bữa ăn..."
                      />
                    ) : (
                      <div className="form-control-plaintext">
                        {memberProfile?.smokingTriggers || "Chưa có thông tin"}
                      </div>
                    )}
                  </div>
                </div>

                {/* Health Information Section */}
                <div className="col-12">
                  <hr />
                  <h6 className="text-success">
                    <i className="fas fa-heartbeat me-2" />
                    Thông tin sức khỏe
                  </h6>
                </div>

                <div className="col-12">
                  <div className="mb-3">
                    <label className="form-label">
                      <i className="fas fa-stethoscope me-1" />
                      Tình trạng sức khỏe hiện tại
                    </label>
                    {isEditing ? (
                      <textarea
                        className="form-control"
                        name="health"
                        value={formData.health}
                        onChange={handleFormChange}
                        rows="3"
                        placeholder="Mô tả tình trạng sức khỏe hiện tại..."
                      />
                    ) : (
                      <div className="form-control-plaintext">
                        {memberProfile?.health || "Chưa có thông tin"}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-success">
                    <i className="fas fa-save me-1" />
                    Lưu thay đổi
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={handleCancel}
                  >
                    <i className="fas fa-times me-1" />
                    Hủy
                  </button>
                </div>
              )}
            </form>
          ) : (
            <div className="text-center py-5">
              <i className="fas fa-user-plus text-muted" style={{ fontSize: "4rem" }} />
              <h4 className="mt-3 text-muted">Chưa có thông tin hồ sơ</h4>
              <p className="text-muted">
                Hãy tạo hồ sơ cá nhân để bắt đầu hành trình cai thuốc
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Additional Profile Info */}
      {memberProfile && (
        <div className="card mt-4">
          <div className="card-header">
            <h5 className="mb-0">
              <i className="fas fa-info-circle me-2" />
              Thông tin bổ sung
            </h5>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <div className="d-flex align-items-center mb-2">
                  <i className="fas fa-calendar-alt text-primary me-2" />
                  <strong>Ngày tạo hồ sơ:</strong>
                  <span className="ms-2">
                    {memberProfile.createdAt 
                      ? new Date(memberProfile.createdAt).toLocaleDateString('vi-VN')
                      : "Không có thông tin"
                    }
                  </span>
                </div>
              </div>
              <div className="col-md-6">
                <div className="d-flex align-items-center mb-2">
                  <i className="fas fa-id-badge text-primary me-2" />
                  <strong>ID hồ sơ:</strong>
                  <span className="ms-2">{memberProfile.memberId}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileManager;
