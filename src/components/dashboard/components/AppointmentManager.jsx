// Appointment management component
import React from "react";
import ChatSupport from "../../chat/ChatSupport";

const AppointmentManager = ({ appointments, coachList, fetchAppointments }) => {
  const [selectedUserId, setSelectedUserId] = React.useState(null);
  const [selectedDisplayName, setSelectedDisplayName] = React.useState("");

  const handleChat = (userId, displayName) => {
    setSelectedUserId(userId);
    setSelectedDisplayName(displayName);
  };

  const handleCloseChat = () => {
    setSelectedUserId(null);
    setSelectedDisplayName("");
  };

  // Lọc các appointment unique theo memberUserId
  const uniqueMemberUserIds = new Set();
  const filteredAppointments = appointments.filter((item) => {
    if (!uniqueMemberUserIds.has(item.memberUserId)) {
      uniqueMemberUserIds.add(item.memberUserId);
      return true;
    }
    return false;
  });

  return (
    <div className="appointment-manager">
      <div className="row">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <i className="fas fa-calendar-check me-2" />
                Danh sách lịch hẹn ({filteredAppointments.length})
              </h5>
              <button
                className="btn btn-primary btn-sm"
                onClick={fetchAppointments}
              >
                <i className="fas fa-sync me-1" />
                Làm mới
              </button>
            </div>
            <div className="card-body">
              {filteredAppointments.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Huấn luyện viên</th>
                        <th>Thời gian</th>
                        <th>Trạng thái</th>
                        <th>Ghi chú</th>
                        <th>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAppointments.map((appointment, idx) => (
                        <tr key={appointment.appointmentId || idx}>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="avatar-sm bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2">
                                <i className="fas fa-user" />
                              </div>
                              <div>
                                <div className="fw-bold">
                                  {appointment.coachDisplayName || "Chưa có tên"}
                                </div>
                                <small className="text-muted">
                                  ID: {appointment.coachUserId}
                                </small>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div>
                              <div className="fw-bold">
                                {appointment.appointmentDate
                                  ? new Date(appointment.appointmentDate).toLocaleDateString('vi-VN')
                                  : "Không có ngày"
                                }
                              </div>
                              <small className="text-muted">
                                {appointment.appointmentTime || "Không có giờ"}
                              </small>
                            </div>
                          </td>
                          <td>
                            <span className={`badge ${
                              appointment.status === "Confirmed" ? "bg-success" :
                              appointment.status === "Pending" ? "bg-warning" :
                              appointment.status === "Cancelled" ? "bg-danger" :
                              "bg-secondary"
                            }`}>
                              {appointment.status === "Confirmed" ? "Đã xác nhận" :
                               appointment.status === "Pending" ? "Chờ xác nhận" :
                               appointment.status === "Cancelled" ? "Đã hủy" :
                               appointment.status || "Không rõ"}
                            </span>
                          </td>
                          <td>
                            <div style={{ maxWidth: "200px" }}>
                              {appointment.notes && appointment.notes.length > 50
                                ? `${appointment.notes.substring(0, 50)}...`
                                : appointment.notes || "Không có ghi chú"
                              }
                            </div>
                          </td>
                          <td>
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => handleChat(
                                appointment.coachUserId, 
                                appointment.coachDisplayName || "Coach"
                              )}
                            >
                              <i className="fas fa-comments me-1" />
                              Chat
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-5">
                  <i className="fas fa-calendar-times text-muted" style={{ fontSize: "4rem" }} />
                  <h4 className="mt-3 text-muted">Chưa có lịch hẹn nào</h4>
                  <p className="text-muted">
                    Lịch hẹn với huấn luyện viên sẽ xuất hiện ở đây
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="fas fa-users me-2" />
                Huấn luyện viên ({coachList.length})
              </h5>
            </div>
            <div className="card-body">
              {coachList.length > 0 ? (
                <div className="list-group list-group-flush">
                  {coachList.map((coach, idx) => (
                    <div key={coach.id || idx} className="list-group-item px-0">
                      <div className="d-flex align-items-center">
                        <div className="avatar-sm bg-success text-white rounded-circle d-flex align-items-center justify-content-center me-3">
                          <i className="fas fa-user-tie" />
                        </div>
                        <div className="flex-grow-1">
                          <div className="fw-bold">{coach.displayName || coach.name}</div>
                          <small className="text-muted">
                            {coach.email || `ID: ${coach.id}`}
                          </small>
                        </div>
                        <button
                          className="btn btn-sm btn-outline-success"
                          onClick={() => handleChat(coach.id, coach.displayName || coach.name)}
                        >
                          <i className="fas fa-comment-dots" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-3">
                  <i className="fas fa-user-slash text-muted" style={{ fontSize: "2rem" }} />
                  <p className="mt-2 mb-0 text-muted">
                    Chưa có huấn luyện viên nào
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

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
