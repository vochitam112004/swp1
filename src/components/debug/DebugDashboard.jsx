import React, { useState } from 'react';
import './debug-dashboard.css';

// Component debug đơn giản để test chức năng chuyển tab
const DebugDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const handleTabClick = (tabName) => {
    console.log(`🔄 Switching to tab: ${tabName}`);
    console.log(`📊 Previous tab: ${activeTab}`);
    setActiveTab(tabName);
    console.log(`✅ New active tab: ${tabName}`);
  };

  const renderTabContent = () => {
    console.log(`🎯 Rendering content for tab: ${activeTab}`);
    
    switch (activeTab) {
      case "overview":
        return (
          <div className="tab-content-panel">
            <h2>📊 Tổng quan</h2>
            <div className="status-card success">
              <h3>✅ Tab đã chuyển thành công!</h3>
              <p>Bạn đang xem tab <strong>{activeTab}</strong></p>
            </div>
            
            <div className="quick-actions">
              <button 
                className="action-btn primary"
                onClick={() => handleTabClick("daily-log")}
              >
                🔄 Chuyển đến "Ghi nhận hôm nay"
              </button>
              <button 
                className="action-btn secondary"
                onClick={() => handleTabClick("progress")}
              >
                🔄 Chuyển đến "Tiến trình"
              </button>
              <button 
                className="action-btn tertiary"
                onClick={() => handleTabClick("plan")}
              >
                🔄 Chuyển đến "Kế hoạch"
              </button>
            </div>
          </div>
        );
      
      case "daily-log":
        return (
          <div className="tab-content-panel">
            <h2>✅ Ghi nhận hôm nay</h2>
            <div className="status-card info">
              <h3>📝 Form ghi nhận tiến trình</h3>
              <p>Chức năng chuyển tab hoạt động! Tab hiện tại: <strong>{activeTab}</strong></p>
              <ul>
                <li>Số điếu thuốc đã hút: ✅</li>
                <li>Tâm trạng: ✅</li>
                <li>Yếu tố kích hoạt: ✅</li>
                <li>Triệu chứng: ✅</li>
              </ul>
            </div>
            <button 
              className="action-btn secondary"
              onClick={() => handleTabClick("overview")}
            >
              ⬅️ Quay về Tổng quan
            </button>
          </div>
        );
      
      case "progress":
        return (
          <div className="tab-content-panel">
            <h2>📈 Tiến trình</h2>
            <div className="status-card warning">
              <h3>📊 Biểu đồ và thống kê</h3>
              <p>Tab chuyển thành công! Đang hiển thị: <strong>{activeTab}</strong></p>
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-number">7</div>
                  <div className="stat-label">Ngày không hút</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">85%</div>
                  <div className="stat-label">Tiến độ</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">12</div>
                  <div className="stat-label">Ghi nhận</div>
                </div>
              </div>
            </div>
            <button 
              className="action-btn secondary"
              onClick={() => handleTabClick("overview")}
            >
              ⬅️ Quay về Tổng quan
            </button>
          </div>
        );
      
      case "plan":
        return (
          <div className="tab-content-panel">
            <h2>📅 Kế hoạch</h2>
            <div className="status-card success">
              <h3>🎯 Kế hoạch cai thuốc</h3>
              <p>Chuyển tab thành công! Tab hiện tại: <strong>{activeTab}</strong></p>
              <div className="plan-timeline">
                <div className="plan-step completed">
                  <div className="step-number">1</div>
                  <div className="step-content">
                    <h4>Tuần 1</h4>
                    <p>Giảm xuống 10 điếu/ngày</p>
                  </div>
                </div>
                <div className="plan-step active">
                  <div className="step-number">2</div>
                  <div className="step-content">
                    <h4>Tuần 2</h4>
                    <p>Giảm xuống 7 điếu/ngày</p>
                  </div>
                </div>
                <div className="plan-step">
                  <div className="step-number">3</div>
                  <div className="step-content">
                    <h4>Tuần 3</h4>
                    <p>Giảm xuống 4 điếu/ngày</p>
                  </div>
                </div>
              </div>
            </div>
            <button 
              className="action-btn secondary"
              onClick={() => handleTabClick("overview")}
            >
              ⬅️ Quay về Tổng quan
            </button>
          </div>
        );
      
      case "journal":
        return (
          <div className="tab-content-panel">
            <h2>📖 Nhật ký</h2>
            <div className="status-card info">
              <h3>📝 Ghi chép cá nhân</h3>
              <p>Tab active: <strong>{activeTab}</strong></p>
            </div>
            <button 
              className="action-btn secondary"
              onClick={() => handleTabClick("overview")}
            >
              ⬅️ Quay về Tổng quan
            </button>
          </div>
        );
      
      case "achievements":
        return (
          <div className="tab-content-panel">
            <h2>🏆 Thành tích</h2>
            <div className="status-card success">
              <h3>🥇 Huy hiệu và thành tựu</h3>
              <p>Tab active: <strong>{activeTab}</strong></p>
            </div>
            <button 
              className="action-btn secondary"
              onClick={() => handleTabClick("overview")}
            >
              ⬅️ Quay về Tổng quan
            </button>
          </div>
        );
      
      default:
        return (
          <div className="tab-content-panel">
            <h2>❓ Tab không xác định</h2>
            <div className="status-card error">
              <h3>⚠️ Lỗi</h3>
              <p>Tab không tồn tại: <strong>{activeTab}</strong></p>
            </div>
            <button 
              className="action-btn primary"
              onClick={() => handleTabClick("overview")}
            >
              🏠 Về trang chủ
            </button>
          </div>
        );
    }
  };

  return (
    <div className="debug-dashboard">
      <div className="debug-header">
        <h1>🔍 Debug Dashboard - Test Tab Navigation</h1>
        <div className="debug-info">
          <span className="current-tab">Current Tab: <strong>{activeTab}</strong></span>
          <span className="status online">Status: ✅ Online</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="nav-container">
        <ul className="nav-tabs">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "overview" ? "active" : ""}`}
              onClick={() => handleTabClick("overview")}
            >
              📊 Tổng quan
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "daily-log" ? "active" : ""}`}
              onClick={() => handleTabClick("daily-log")}
            >
              ✅ Ghi nhận hôm nay
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "progress" ? "active" : ""}`}
              onClick={() => handleTabClick("progress")}
            >
              📈 Tiến trình
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "plan" ? "active" : ""}`}
              onClick={() => handleTabClick("plan")}
            >
              📅 Kế hoạch
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "journal" ? "active" : ""}`}
              onClick={() => handleTabClick("journal")}
            >
              📖 Nhật ký
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "achievements" ? "active" : ""}`}
              onClick={() => handleTabClick("achievements")}
            >
              🏆 Thành tích
            </button>
          </li>
        </ul>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {renderTabContent()}
      </div>

      {/* Debug Panel */}
      <div className="debug-panel">
        <h3>🛠️ Debug Information</h3>
        <div className="debug-item">
          <strong>Active Tab:</strong> {activeTab}
        </div>
        <div className="debug-item">
          <strong>Tab Switch Function:</strong> ✅ Working
        </div>
        <div className="debug-item">
          <strong>State Management:</strong> ✅ useState Hook
        </div>
        <div className="debug-item">
          <strong>Event Handlers:</strong> ✅ onClick Events
        </div>
        <div className="debug-item">
          <strong>Content Rendering:</strong> ✅ Switch Statement
        </div>
      </div>
    </div>
  );
};

export default DebugDashboard;
