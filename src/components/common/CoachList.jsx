import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import ChatSupport from '../chat/ChatSupport';
import '../../css/CoachList.css';

const CoachList = () => {
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCoach, setSelectedCoach] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCoaches();
  }, []);

  const fetchCoaches = async () => {
    try {
      setLoading(true);
      // Thử nhiều endpoints khác nhau để lấy danh sách coaches
      let response;
      try {
        response = await api.get('/ChatMessage/available-contacts');
      } catch (error) {
        // Nếu endpoint trên không hoạt động, thử endpoint khác
        response = await api.get('/Coach');
      }

      const coachData = response.data || [];
      // Đảm bảo data có cấu trúc đúng
      const formattedCoaches = coachData.map(coach => ({
        userId: coach.userId || coach.id,
        displayName: coach.displayName || coach.name,
        username: coach.username,
        email: coach.email,
        avatarUrl: coach.avatarUrl || coach.avatar
      }));

      setCoaches(formattedCoaches);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách huấn luyện viên:', error);
      toast.error('Không thể tải danh sách huấn luyện viên');
    } finally {
      setLoading(false);
    }
  };

  const handleStartChat = (coach) => {
    setSelectedCoach(coach);
    setShowChat(true);
  };

  const handleCloseChat = () => {
    setShowChat(false);
    setSelectedCoach(null);
  };

  if (loading) {
    return (
      <div className="coach-list-container">
        <div className="coach-list-header">
          <h1>Chat với huấn luyện viên</h1>
          <p>Nhận sự vấn tư, tâp đức và các chuyên gia về các nghiệm và cai thuốc lá</p>
        </div>
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Đang tải danh sách huấn luyện viên...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="coach-list-container">
      {/* Header */}
      <div className="coach-list-header">
        <h1>Chat với huấn luyện viên</h1>
        <p>Nhận sự vấn tư, tâp đức và các chuyên gia về các nghiệm và cai thuốc lá</p>
      </div>

      {/* Chọn huấn luyện viên phù hợp */}
      <div className="coach-selection-section">
        <h2>Chọn huấn luyện viên phù hợp</h2>
        <p>Tất cả huấn luyện viên của chúng tôi là chuyên gia có kinh nghiệm và cải nghiện thuốc lá</p>

        {coaches.length > 0 ? (
          <div className="coaches-grid">
            {coaches.map((coach) => (
              <div key={coach.userId} className="coach-card">
                <div className="coach-avatar">
                  <img
                    src={coach.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(coach.displayName || coach.username)}&background=4285f4&color=fff&size=80`}
                    alt={coach.displayName}
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(coach.displayName || coach.username)}&background=4285f4&color=fff&size=80`;
                    }}
                  />
                  <div className="online-indicator"></div>
                </div>

                <div className="coach-info">
                  <h3>{coach.displayName}</h3>
                  <p className="coach-specialty">Chuyên gia tâm lý cai nghiện</p>
                  <p className="coach-experience">6 năm kinh nghiệm</p>

                  <div className="coach-rating">
                    {[...Array(5)].map((_, i) => (
                      <i key={i} className="fas fa-star"></i>
                    ))}
                    <span>4.9</span>
                  </div>

                  <div className="coach-stats">
                    <span>Phản hồi • 5 phút</span>
                  </div>

                  <div className="coach-status">
                    <span className="status-indicator online"></span>
                    <span>Đang online</span>
                  </div>
                </div>

                <button
                  className="start-chat-btn"
                  onClick={() => handleStartChat(coach)}
                >
                  Bắt đầu chat
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-coaches">
            <i className="fas fa-user-slash"></i>
            <h3>Hiện tại chưa có huấn luyện viên nào</h3>
            <p>Vui lòng quay lại sau.</p>
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="features-section">
        <div className="feature-item">
          <div className="feature-icon">
            <i className="fas fa-shield-alt"></i>
          </div>
          <div className="feature-content">
            <h4>Bảo mật tuyệt đối</h4>
            <p>Mọi cuộc trò chuyện được mã hóa và bảo mật hoàn toàn</p>
          </div>
        </div>

        <div className="feature-item">
          <div className="feature-icon">
            <i className="fas fa-clock"></i>
          </div>
          <div className="feature-content">
            <h4>Phản hồi nhanh</h4>
            <p>Huấn luyện viên sẽ phản hồi trong vòng 5 phút hoặc ít hơn</p>
          </div>
        </div>

        <div className="feature-item">
          <div className="feature-icon">
            <i className="fas fa-user-graduate"></i>
          </div>
          <div className="feature-content">
            <h4>Tư vấn chuyên nghiệp</h4>
            <p>Nhận tư vấn từ các chuyên gia có kinh nghiệm và đã nghiên cứu</p>
          </div>
        </div>
      </div>

      {/* Chat Modal */}
      {showChat && selectedCoach && (
        <ChatSupport
          targetUserId={selectedCoach.userId}
          targetDisplayName={selectedCoach.displayName}
          onClose={handleCloseChat}
          isModal={false}
        />
      )}
    </div>
  );
};

export default CoachList;
