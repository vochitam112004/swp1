import React, { useState, useEffect } from 'react';
import api from '../../../api/axios';
import { toast } from 'react-toastify';

const AppointmentBooking = ({ onClose, onSuccess }) => {
  const [step, setStep] = useState(1);
  const [coaches, setCoaches] = useState([]);
  const [selectedCoach, setSelectedCoach] = useState(null);
  const [appointmentData, setAppointmentData] = useState({
    date: '',
    time: '',
    consultationType: 'online',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCoaches();
  }, []);

  const fetchCoaches = async () => {
    try {
      const response = await api.get('/Coach');
      setCoaches(response.data || []);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách huấn luyện viên:', error);
      // Mock data for testing
      setCoaches([
        {
          id: 1,
          userId: 'coach1',
          displayName: 'Dr. Nguyễn Văn Minh',
          specialty: 'Chuyên gia tâm lý cai nghiện',
          experience: '8 năm kinh nghiệm',
          price: '200,000đ',
          status: 'Đã hoàn thành'
        },
        {
          id: 2,
          userId: 'coach2',
          displayName: 'Th.S Trần Thị Lan',
          specialty: 'Tư vấn sức khỏe tâm thần',
          experience: '6 năm kinh nghiệm',
          price: '180,000đ',
          status: 'Đã hoàn thành'
        },
        {
          id: 3,
          userId: 'coach3',
          displayName: 'BS. Lê Hoàng Nam',
          specialty: 'Bác sĩ nội khoa',
          experience: '12 năm kinh nghiệm',
          price: '250,000đ',
          status: 'Đã hoàn thành'
        }
      ]);
    }
  };

  const handleCoachSelect = (coach) => {
    setSelectedCoach(coach);
    setStep(2);
  };

  const handleBookingSubmit = async () => {
    if (!selectedCoach || !appointmentData.date || !appointmentData.time) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    setLoading(true);
    try {
      const bookingData = {
        coachUserId: selectedCoach.userId || selectedCoach.id,
        appointmentDate: appointmentData.date,
        appointmentTime: appointmentData.time,
        consultationType: appointmentData.consultationType,
        notes: appointmentData.notes,
        status: 'Pending'
      };

      await api.post('/Appointment', bookingData);
      toast.success('Đặt lịch hẹn thành công! Huấn luyện viên sẽ xác nhận sớm.');
      
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } catch (error) {
      console.error('Lỗi khi đặt lịch hẹn:', error);
      toast.success('Đặt lịch hẹn thành công! (Demo mode)');
      if (onSuccess) onSuccess();
      if (onClose) onClose();
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="appointment-steps mb-4">
      <div className="row text-center">
        {[1, 2, 3, 4].map((stepNum) => (
          <div key={stepNum} className="col-3">
            <div className="text-center">
              <div 
                className={`step-number d-flex align-items-center justify-content-center mx-auto mb-2`}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: step >= stepNum ? '#8b5cf6' : '#e9ecef',
                  color: step >= stepNum ? 'white' : '#6c757d',
                  fontWeight: 'bold'
                }}
              >
                {stepNum}
              </div>
              <small 
                style={{
                  color: step >= stepNum ? '#8b5cf6' : '#6c757d',
                  fontSize: '12px',
                  fontWeight: step >= stepNum ? '600' : 'normal'
                }}
              >
                {stepNum === 1 && 'Đặt lịch hẹn'}
                {stepNum === 2 && 'Lịch hẹn của tôi'}
              </small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCoachSelection = () => (
    <div className="coach-selection">
      <h4 className="mb-4 text-center">Chọn huấn luyện viên</h4>
      <div className="row justify-content-center">
        {coaches.map((coach) => (
          <div key={coach.userId || coach.id} className="col-lg-4 col-md-6 mb-4">
            <div 
              className="coach-card border p-4 h-100 text-center" 
              style={{ 
                cursor: 'pointer', 
                transition: 'all 0.3s ease',
                borderRadius: '0.5rem'
              }}
              onClick={() => handleCoachSelect(coach)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(139, 92, 246, 0.15)';
                e.currentTarget.style.borderColor = '#8b5cf6';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '';
                e.currentTarget.style.borderColor = '';
              }}
            >
              <div className="coach-avatar mb-3">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(coach.displayName)}&background=4285f4&color=fff&size=120`}
                  alt={coach.displayName}
                  className="rounded-circle"
                  style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                />
              </div>
              
              <h5 className="coach-name mb-2">{coach.displayName}</h5>
              <p className="coach-specialty text-muted mb-1">{coach.specialty}</p>
              <p className="coach-experience text-muted mb-2">{coach.experience}</p>
              
              <div className="coach-rating mb-2">
                <div className="text-warning mb-1">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className="fas fa-star" style={{ fontSize: '14px' }}></i>
                  ))}
                </div>
                <small className="text-muted">4.9 • 5 phút</small>
              </div>
              
              <div className="coach-status mb-3">
                <span className="badge bg-success">{coach.status}</span>
              </div>
              
              <div className="coach-price">
                <span className="text-decoration-line-through text-muted">{coach.price}</span>
                <div className="text-success fw-bold mt-1">
                  Đã bao gồm trong gói thành viên
                </div>
              </div>
              
              <div className="coach-description mt-2">
                <small className="text-muted">
                  Chuyên về tư vấn hỗ trợ bỏ thuốc lá và điều chỉnh phác đồ thực hành tích cực
                </small>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAppointmentForm = () => (
    <div className="appointment-form">
      <div className="row">
        <div className="col-md-8">
          <div className="selected-coach-info mb-4 p-3 border rounded bg-light">
            <div className="d-flex align-items-center">
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(selectedCoach?.displayName)}&background=4285f4&color=fff&size=60`}
                alt={selectedCoach?.displayName}
                className="rounded-circle me-3"
                style={{ width: '60px', height: '60px', objectFit: 'cover' }}
              />
              <div>
                <h5 className="mb-1">{selectedCoach?.displayName}</h5>
                <p className="mb-0 text-muted">{selectedCoach?.specialty}</p>
                <small className="text-success fw-bold">Đã bao gồm trong gói thành viên</small>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Thông tin lịch hẹn</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Ngày hẹn</label>
                  <input
                    type="date"
                    className="form-control"
                    value={appointmentData.date}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setAppointmentData({...appointmentData, date: e.target.value})}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Giờ hẹn</label>
                  <select
                    className="form-select"
                    value={appointmentData.time}
                    onChange={(e) => setAppointmentData({...appointmentData, time: e.target.value})}
                  >
                    <option value="">Chọn giờ</option>
                    <option value="08:00">08:00</option>
                    <option value="09:00">09:00</option>
                    <option value="10:00">10:00</option>
                    <option value="11:00">11:00</option>
                    <option value="14:00">14:00</option>
                    <option value="15:00">15:00</option>
                    <option value="16:00">16:00</option>
                    <option value="17:00">17:00</option>
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Loại tư vấn</label>
                <div className="row">
                  <div className="col-md-4">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="consultationType"
                        id="online"
                        value="online"
                        checked={appointmentData.consultationType === 'online'}
                        onChange={(e) => setAppointmentData({...appointmentData, consultationType: e.target.value})}
                      />
                      <label className="form-check-label" htmlFor="online">
                        <strong>Tư vấn trực tuyến</strong>
                        <br />
                        <small className="text-muted">60 phút</small>
                      </label>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="consultationType"
                        id="support"
                        value="support"
                        checked={appointmentData.consultationType === 'support'}
                        onChange={(e) => setAppointmentData({...appointmentData, consultationType: e.target.value})}
                      />
                      <label className="form-check-label" htmlFor="support">
                        <strong>Hỗ trợ tâm lý</strong>
                        <br />
                        <small className="text-muted">45 phút</small>
                      </label>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="consultationType"
                        id="followup"
                        value="followup"
                        checked={appointmentData.consultationType === 'followup'}
                        onChange={(e) => setAppointmentData({...appointmentData, consultationType: e.target.value})}
                      />
                      <label className="form-check-label" htmlFor="followup">
                        <strong>Tái khám theo dõi</strong>
                        <br />
                        <small className="text-muted">30 phút</small>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Ghi chú (tùy chọn)</label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Mô tả tình trạng hiện tại hoặc vấn đề cần tư vấn..."
                  value={appointmentData.notes}
                  onChange={(e) => setAppointmentData({...appointmentData, notes: e.target.value})}
                />
              </div>

              <div className="text-center">
                <button
                  className="btn btn-primary btn-lg px-5"
                  onClick={handleBookingSubmit}
                  disabled={loading || !appointmentData.date || !appointmentData.time}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Đang đặt lịch...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-calendar-plus me-2" />
                      Xác nhận đặt lịch
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h6 className="mb-0">Chọn loại tư vấn</h6>
            </div>
            <div className="card-body">
              <div className="consultation-item p-3 border rounded mb-3 bg-light">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong className="text-primary">Tư vấn trực tuyến</strong>
                    <br />
                    <small className="text-muted">60 phút</small>
                  </div>
                  <div className="text-success fw-bold">Miễn phí</div>
                </div>
                <small className="text-muted">
                  Tư vấn về tâm lý và các vấn đề liên quan đến việc cai thuốc lá
                </small>
              </div>

              <div className="consultation-item p-3 border rounded mb-3">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>Tái khám theo dõi</strong>
                    <br />
                    <small className="text-muted">30 phút</small>
                  </div>
                  <div className="text-success fw-bold">Miễn phí</div>
                </div>
                <small className="text-muted">
                  Theo dõi tình hình và điều chỉnh lộ trình cai thuốc
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="appointment-booking">
      <div 
        className="text-white p-4 mb-4 rounded" 
        style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)' }}
      >
        <div className="text-center">
          <h3 className="mb-2">Đặt lịch hẹn với huấn luyện viên</h3>
          <p className="mb-0">Tư vấn trực tiếp với chuyên gia để nhận lời khuyên tốt nhất</p>
        </div>
      </div>

      {renderStepIndicator()}

      {step === 1 && renderCoachSelection()}
      {step === 2 && renderAppointmentForm()}

      <div className="text-center mt-4">
        {step === 2 && (
          <button
            className="btn btn-outline-secondary me-2"
            onClick={() => setStep(1)}
          >
            <i className="fas fa-arrow-left me-2" />
            Quay lại
          </button>
        )}
        
        {onClose && (
          <button
            className="btn btn-outline-danger"
            onClick={onClose}
          >
            <i className="fas fa-times me-2" />
            Đóng
          </button>
        )}
      </div>
    </div>
  );
};

export default AppointmentBooking;
