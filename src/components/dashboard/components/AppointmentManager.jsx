// Appointment management component
import React from "react";
import ChatSupport from "../../chat/ChatSupport";
import AppointmentBooking from "./AppointmentBooking";

// Inline AppointmentList component để tránh lỗi import
const AppointmentList = ({ appointments, onChatWithCoach }) => {
  // Lọc các appointment unique theo memberUserId
  const uniqueMemberUserIds = new Set();
  const filteredAppointments = appointments.filter((item) => {
    if (!uniqueMemberUserIds.has(item.memberUserId)) {
      uniqueMemberUserIds.add(item.memberUserId);
      return true;
    }
    return false;
  });

  if (filteredAppointments.length === 0) {
    return (
      <div className="text-center py-5">
        <div className="mb-4">
          <i className="fas fa-calendar-times text-muted" style={{ fontSize: '4rem' }} />
        </div>
        <h4 className="text-muted mb-3">Chưa có lịch hẹn nào</h4>
        <p className="text-muted mb-0">
          Lịch hẹn với huấn luyện viên sẽ xuất hiện ở đây sau khi bạn đặt lịch
        </p>
      </div>
    );
  }

  return (
    <div className="appointment-list">
      <h4 className="mb-4">
        <i className="fas fa-calendar-alt text-primary me-2" />
        Lịch hẹn của bạn ({filteredAppointments.length})
      </h4>
      
      <div className="row">
        {filteredAppointments.map((appointment, idx) => (
          <div key={appointment.appointmentId || idx} className="col-lg-6 mb-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body p-4">
                <div className="d-flex align-items-start">
                  <div className="coach-avatar me-3">
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(appointment.coachDisplayName || 'Coach')}&background=8b5cf6&color=fff&size=70`}
                      alt={appointment.coachDisplayName || 'Coach'}
                      className="rounded-circle"
                      style={{ width: '70px', height: '70px', objectFit: 'cover' }}
                    />
                  </div>
                  
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <h5 className="mb-1 text-dark">{appointment.coachDisplayName || 'Chưa có tên'}</h5>
                        <small className="text-muted">
                          <i className="fas fa-stethoscope me-1" />
                          {appointment.consultationType || 'Tư vấn trực tuyến'}
                        </small>
                      </div>
                      <span className={`badge ${
                        appointment.status === "Confirmed" ? "bg-success" :
                        appointment.status === "Pending" ? "bg-warning text-dark" :
                        appointment.status === "Cancelled" ? "bg-danger" :
                        "bg-secondary"
                      } fs-6`}>
                        {appointment.status === "Confirmed" ? "Đã xác nhận" :
                         appointment.status === "Pending" ? "Chờ xác nhận" :
                         appointment.status === "Cancelled" ? "Đã hủy" :
                         appointment.status || "Chờ xử lý"}
                      </span>
                    </div>
                    
                    <div className="appointment-details mb-3">
                      <div className="row g-2">
                        <div className="col-sm-6">
                          <div className="d-flex align-items-center text-muted">
                            <i className="fas fa-calendar text-primary me-2"></i>
                            <small>
                              {appointment.appointmentDate
                                ? new Date(appointment.appointmentDate).toLocaleDateString('vi-VN', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric'
                                  })
                                : "Chưa xác định"
                              }
                            </small>
                          </div>
                        </div>
                        <div className="col-sm-6">
                          <div className="d-flex align-items-center text-muted">
                            <i className="fas fa-clock text-primary me-2"></i>
                            <small>{appointment.appointmentTime || "Chưa xác định"}</small>
                          </div>
                        </div>
                      </div>

                      <div className="d-flex align-items-center text-muted mt-2">
                        <i className="fas fa-video text-primary me-2"></i>
                        <small>Cuộc hẹn trực tuyến • 45 phút</small>
                      </div>
                    </div>
                    
                    {appointment.notes && (
                      <div className="appointment-notes mb-3 p-2 bg-light rounded">
                        <small className="text-muted">
                          <strong className="text-dark">Ghi chú:</strong>
                          <div className="mt-1">
                            {appointment.notes.length > 100 
                              ? `${appointment.notes.substring(0, 100)}...`
                              : appointment.notes
                            }
                          </div>
                        </small>
                      </div>
                    )}
                    
                    <div className="appointment-actions d-flex gap-2 flex-wrap">
                      <button
                        className="btn btn-primary btn-sm flex-fill"
                        onClick={() => onChatWithCoach && onChatWithCoach(
                          appointment.coachUserId, 
                          appointment.coachDisplayName || "Coach"
                        )}
                      >
                        <i className="fas fa-comments me-2" />
                        Chat với huấn luyện viên
                      </button>
                      
                      {appointment.status === "Pending" && (
                        <button className="btn btn-outline-secondary btn-sm">
                          <i className="fas fa-edit me-1" />
                          Sửa
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AppointmentManager = ({ appointments, coachList, fetchAppointments }) => {
  const [selectedUserId, setSelectedUserId] = React.useState(null);
  const [selectedDisplayName, setSelectedDisplayName] = React.useState("");
  const [showBooking, setShowBooking] = React.useState(false);
  const [activeView, setActiveView] = React.useState('list'); // 'list' or 'booking'

  const handleChat = (userId, displayName) => {
    setSelectedUserId(userId);
    setSelectedDisplayName(displayName);
  };

  const handleCloseChat = () => {
    setSelectedUserId(null);
    setSelectedDisplayName("");
  };

  const handleShowBooking = () => {
    setActiveView('booking');
    setShowBooking(true);
  };

  const handleCloseBooking = () => {
    setActiveView('list');
    setShowBooking(false);
  };

  const handleBookingSuccess = () => {
    setActiveView('list');
    setShowBooking(false);
    fetchAppointments(); // Refresh appointments list
  };

  return (
    <div className="appointment-manager">
      {activeView === 'booking' ? (
        <AppointmentBooking 
          onClose={handleCloseBooking}
          onSuccess={handleBookingSuccess}
        />
      ) : (
        <div className="appointment-view">
          {/* Header with navigation */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h4 className="mb-1">
                <i className="fas fa-calendar-check me-2 text-primary" />
                Quản lý lịch hẹn
              </h4>
              <p className="text-muted mb-0">Đặt lịch và theo dõi cuộc hẹn với huấn luyện viên</p>
            </div>
            <div>
              <button
                className="btn btn-primary me-2"
                onClick={handleShowBooking}
              >
                <i className="fas fa-plus me-1" />
                Đặt lịch hẹn mới
              </button>
              <button
                className="btn btn-outline-primary"
                onClick={fetchAppointments}
              >
                <i className="fas fa-sync me-1" />
                Làm mới
              </button>
            </div>
          </div>

          {/* Appointment List */}
          <AppointmentList 
            appointments={appointments}
            onChatWithCoach={handleChat}
          />

          {/* Available Coaches Section */}
          <div className="available-coaches mt-5">
            <div className="card">
              <div className="card-header">
                <h5 className="mb-0">
                  <i className="fas fa-users me-2" />
                  Huấn luyện viên có sẵn ({coachList.length})
                </h5>
              </div>
              <div className="card-body">
                {coachList.length > 0 ? (
                  <div className="row">
                    {coachList.map((coach, idx) => (
                      <div key={coach.id || idx} className="col-md-6 col-lg-4 mb-3">
                        <div className="coach-item p-3 border rounded">
                          <div className="d-flex align-items-center">
                            <div className="coach-avatar me-3">
                              <img
                                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(coach.displayName || coach.name)}&background=4285f4&color=fff&size=50`}
                                alt={coach.displayName || coach.name}
                                className="rounded-circle"
                                style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                              />
                            </div>
                            <div className="flex-grow-1">
                              <h6 className="mb-1">{coach.displayName || coach.name}</h6>
                              <small className="text-muted d-block">{coach.email || `ID: ${coach.id}`}</small>
                              <span className="badge bg-success-subtle text-success mt-1">
                                <i className="fas fa-circle me-1" style={{ fontSize: '8px' }}></i>
                                Có sẵn
                              </span>
                            </div>
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => handleChat(coach.id, coach.displayName || coach.name)}
                            >
                              <i className="fas fa-comment-dots" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-3">
                    <i className="fas fa-user-slash text-muted" style={{ fontSize: '2rem' }} />
                    <p className="mt-2 mb-0 text-muted">
                      Chưa có huấn luyện viên nào có sẵn
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chat Modal */}
      {selectedUserId && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-comments me-2" />
                  Chat với {selectedDisplayName}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseChat}
                />
              </div>
              <div className="modal-body p-0">
                <ChatSupport
                  targetUserId={selectedUserId}
                  targetDisplayName={selectedDisplayName}
                  onClose={handleCloseChat}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentManager;
