import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../auth/AuthContext";
import api from "../../api/axios";
import "../../css/DashboardNew.css";

const DashboardClean = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    achievements: 38,
    smokeFreeStreak: 23,
    weeklySuccess: 7,
    healthImprovement: 76,
    moneySaved: 345000,
    riskReduction: 68
  });

  // API Connections - Chỉ giữ lại những API cần thiết cho hiển thị thống kê
  const fetchUserProfile = async () => {
    try {
      const response = await api.get("/MemberProfile");
      return response.data;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  };

  const fetchProgressData = async () => {
    try {
      const response = await api.get("/ProgressLog");
      return response.data;
    } catch (error) {
      console.error("Error fetching progress data:", error);
      return [];
    }
  };

  // Load data when component mounts
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch data from APIs
        const [profile, progress] = await Promise.all([
          fetchUserProfile(),
          fetchProgressData()
        ]);

        // Process and update dashboard data
        if (progress && progress.length > 0) {
          // Calculate metrics from real data
          const smokeFreeStreak = calculateSmokeFreeStreak(progress);
          const moneySaved = calculateMoneySaved(progress);
          const healthImprovement = calculateHealthImprovement(progress);
          
          setDashboardData(prev => ({
            ...prev,
            smokeFreeStreak,
            moneySaved,
            healthImprovement
          }));
        }

      } catch (error) {
        console.error("Error loading dashboard data:", error);
        toast.error("Không thể tải dữ liệu dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  // Helper functions
  const calculateSmokeFreeStreak = (progressLogs) => {
    if (!progressLogs || progressLogs.length === 0) return 0;
    
    let streak = 0;
    const sortedLogs = progressLogs.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    for (const log of sortedLogs) {
      if (log.cigarettesSmoked === 0) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const calculateMoneySaved = (progressLogs) => {
    if (!progressLogs || progressLogs.length === 0) return 0;
    
    const pricePerPack = 25000; // Giá trung bình 1 gói thuốc
    const cigarettesPerPack = 20;
    
    let totalCigarettesAvoided = 0;
    progressLogs.forEach(log => {
      const targetCigarettes = 10; // Giả sử mục tiêu là giảm từ 10 điếu/ngày
      const avoided = Math.max(0, targetCigarettes - (log.cigarettesSmoked || 0));
      totalCigarettesAvoided += avoided;
    });
    
    return Math.round((totalCigarettesAvoided / cigarettesPerPack) * pricePerPack);
  };

  const calculateHealthImprovement = (progressLogs) => {
    if (!progressLogs || progressLogs.length === 0) return 0;
    
    const smokeFreeStreak = calculateSmokeFreeStreak(progressLogs);
    return Math.min(100, Math.round(smokeFreeStreak * 3.5)); // 3.5% improvement per smoke-free day
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "50vh" }}>
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-new-container">
      {/* Header thành tích chính */}
      <div className="main-achievement-card">
        <div className="achievement-content">
          <div className="achievement-info">
            <h2>Thành tích của tôi</h2>
            <p>Bạn đã đạt được {user?.fullName || 'Nguyễn Văn A'}</p>
          </div>
          <div className="achievement-percentage">
            <div className="percentage-circle">
              <span className="percentage-text">{dashboardData.achievements}%</span>
            </div>
            <small>Hoàn thành</small>
          </div>
        </div>
      </div>

      {/* Grid thống kê */}
      <div className="stats-grid">
        {/* Ngày liên tiếp */}
        <div className="stat-card stat-card-yellow">
          <div className="stat-icon">💡</div>
          <div className="stat-content">
            <h3>Ngày liên tiếp</h3>
            <p>Hoàn thành ngày 1 tuần không hút thuốc</p>
            <div className="stat-date">Đạt được ngày 15/11/2024</div>
          </div>
        </div>

        {/* Tuần thành công */}
        <div className="stat-card stat-card-green">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>Tuần thành công</h3>
            <p>Không hút thuốc trong 7 ngày liên tiếp</p>
            <div className="stat-date">Đạt được ngày 22/11/2024</div>
          </div>
        </div>

        {/* Tiết kiệm đầu tiên */}
        <div className="stat-card stat-card-blue">
          <div className="stat-icon">🔍</div>
          <div className="stat-content">
            <h3>Tiết kiệm đầu tiên</h3>
            <p>Tiết kiệm được 100.000đ nhờ không hút thuốc</p>
            <div className="stat-date">Đạt được ngày 17/12/2024</div>
          </div>
        </div>

        {/* Sức khỏe cải thiện */}
        <div className="stat-card stat-card-pink">
          <div className="stat-icon">❤️</div>
          <div className="stat-content">
            <h3>Sức khỏe cải thiện</h3>
            <p>Chỉ số sức khỏe đã được cải thiện</p>
            <div className="stat-progress">
              <div className="progress-bar">
                <div className="progress-fill" style={{width: `${dashboardData.healthImprovement}%`}}></div>
              </div>
              <span>{dashboardData.healthImprovement}%</span>
            </div>
          </div>
        </div>

        {/* Ra thăng bền bỉ */}
        <div className="stat-card stat-card-orange">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>Ra thăng bền bỉ</h3>
            <p>Chặng hành trình được ghi nhận khi nguy hiểm</p>
            <div className="stat-progress">
              <div className="progress-bar">
                <div className="progress-fill" style={{width: '24%'}}></div>
              </div>
              <span>Còn ít để đạt được</span>
            </div>
          </div>
        </div>

        {/* Nguồn lời khuyên */}
        <div className="stat-card stat-card-purple">
          <div className="stat-icon">💬</div>
          <div className="stat-content">
            <h3>Nguồn lời khuyên</h3>
            <p>Báo cáo hỗ trợ và nhận những lời khuyên</p>
            <div className="stat-progress">
              <div className="progress-bar">
                <div className="progress-fill" style={{width: '30%'}}></div>
              </div>
              <span>30%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Thành tích sắp tới */}
      <div className="upcoming-achievements">
        <h3>Thành tích sắp tới</h3>
        <div className="achievement-list">
          <div className="achievement-item">
            <div className="achievement-icon-wrapper">
              <span className="achievement-icon">❤️</span>
            </div>
            <div className="achievement-details">
              <h4>Sức khỏe cải thiện</h4>
              <div className="achievement-progress">
                <div className="progress-bar">
                  <div className="progress-fill" style={{width: `${dashboardData.healthImprovement}%`}}></div>
                </div>
                <span>{dashboardData.healthImprovement}%</span>
              </div>
            </div>
          </div>

          <div className="achievement-item">
            <div className="achievement-icon-wrapper">
              <span className="achievement-icon">📅</span>
            </div>
            <div className="achievement-details">
              <h4>Một tháng kiên trì</h4>
              <div className="achievement-progress">
                <div className="progress-bar">
                  <div className="progress-fill" style={{width: '77%'}}></div>
                </div>
                <span>77%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardClean;
