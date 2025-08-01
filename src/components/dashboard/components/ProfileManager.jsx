// Profile management component
import React, { useState } from "react";
import { toast } from "react-toastify";
import api from "../../../api/axios";

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
        memberId: memberProfile.memberId,
        smokingStatus: formData.smokingStatus,
        quitAttempts: parseInt(formData.quitAttempts) || 0,
        experience_level: parseInt(formData.experienceLevel) || 0,
        previousAttempts: formData.previousAttempts,
      };

      await api.put(`/MemberProfile/${memberProfile.memberId}`, updateData);
      
      // Cập nhật state
      setSmokingStatus(formData.smokingStatus);
      setQuitAttempts(parseInt(formData.quitAttempts) || 0);
      setExperienceLevel(parseInt(formData.experienceLevel) || 0);
      setPreviousAttempts(formData.previousAttempts);
      
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
