import React, { useState, useEffect } from 'react';
import api from '../../../api/axios';

const SevenDayProgressChart = () => {
  const [weeklyData, setWeeklyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch weekly schedule data
  useEffect(() => {
    const fetchWeeklyData = async () => {
      try {
        setLoading(true);
        const response = await api.get('/GoalPlanWeeklyReduction/generate-weekly-schedule');
        console.log('Weekly Schedule API Response:', response.data); // Debug log
        setWeeklyData(response.data);
      } catch (err) {
        setError('Không thể tải dữ liệu tuần');
        console.error('Error fetching weekly data:', err);
        console.error('Error details:', err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeeklyData();
  }, []);

  // Tính toán tiến trình dựa trên dữ liệu tuần
  const generateWeeklyProgressData = () => {
    if (!weeklyData.length) return [];
    
    return weeklyData.map((week) => {
      const startDate = new Date(week.startDate);
      const endDate = new Date(week.endDate);
      const today = new Date();
      
      // Tính số ngày đã trải qua trong tuần
      const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
      const passedDays = today > endDate ? totalDays : Math.max(0, Math.ceil((today - startDate) / (1000 * 60 * 60 * 24)) + 1);
      
      // Tính phần trăm tiến trình dựa trên thời gian
      const progressPercent = Math.min((passedDays / totalDays) * 100, 100);
      
      // Debug log
      console.log(`Week ${week.weekNumber}:`, {
        startDate: week.startDate,
        endDate: week.endDate,
        cigarettesReduced: week.cigarettesReduced,
        totalDays,
        passedDays,
        progressPercent: Math.round(progressPercent),
        isActive: today >= startDate && today <= endDate
      });
      
      return {
        weekNumber: week.weekNumber,
        targetReduction: week.cigarettesReduced,
        startDate: week.startDate,
        endDate: week.endDate,
        progressPercent: progressPercent,
        isCompleted: progressPercent >= 100,
        isCurrent: today >= startDate && today <= endDate,
        // Thêm thông tin bổ sung
        totalDays: totalDays,
        passedDays: passedDays,
        remainingDays: Math.max(0, totalDays - passedDays)
      };
    }).sort((a, b) => a.weekNumber - b.weekNumber);
  };

  const weeklyProgress = generateWeeklyProgressData();

  if (loading) {
    return (
      <div className="section-card">
        <div className="card-body">
          <h5 className="card-title mb-4">
            <i className="fas fa-chart-line me-2"></i>
            Tiến trình giảm thuốc theo tuần
          </h5>
          <div className="text-center py-4">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Đang tải...</span>
            </div>
            <p className="mt-2 text-muted">Đang tải dữ liệu...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="section-card">
        <div className="card-body">
          <h5 className="card-title mb-4">
            <i className="fas fa-chart-line me-2"></i>
            Tiến trình giảm thuốc theo tuần
          </h5>
          <div className="text-center py-4">
            <div className="alert alert-warning">
              <i className="fas fa-exclamation-triangle me-2"></i>
              {error}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section-card">
      <div className="card-body">
        <h5 className="card-title mb-4">
          <i className="fas fa-chart-line me-2"></i>
          Tiến trình giảm thuốc theo tuần
        </h5>
        
        <div className="weekly-progress-list">
          {weeklyProgress.map((week, index) => (
            <div key={index} className={`weekly-progress-item ${week.isCurrent ? 'current-week' : ''}`}>
              <div className="week-info">
                <div className="week-circle">
                  <span className="week-number">{week.weekNumber}</span>
                </div>
                <div className="week-details">
                  <div className="week-title">Tuần {week.weekNumber}</div>
                  <div className="week-target">
                    {week.targetReduction > 0 
                      ? `Mục tiêu: ${week.targetReduction} điếu/ngày` 
                      : 'Mục tiêu: Duy trì không hút thuốc'
                    }
                  </div>
                </div>
                <div className="week-date">
                  {new Date(week.endDate).toLocaleDateString('vi-VN', { 
                    day: '2-digit', 
                    month: '2-digit',
                    year: 'numeric'
                  })}
                </div>
              </div>
              
              <div className="progress-bar-container">
                <div className="progress-bar-background">
                  <div 
                    className={`progress-bar-fill ${week.isCompleted ? 'completed' : week.isCurrent ? 'current' : 'pending'}`}
                    style={{ width: `${week.progressPercent}%` }}
                  ></div>
                </div>
                <div className="progress-percentage">
                  {Math.round(week.progressPercent)}%
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {weeklyProgress.length === 0 && !loading && (
          <div className="text-center py-4">
            <div className="text-muted">
              <i className="fas fa-info-circle me-2"></i>
              Chưa có kế hoạch, hãy tạo một kế hoạch mới để theo dõi tiến trình của bạn.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SevenDayProgressChart;
