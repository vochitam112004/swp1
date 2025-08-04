import React, { useState, useEffect } from 'react';
import api from '../../../api/axios';

const SevenDayProgressChart = () => {
  const [weeklyData, setWeeklyData] = useState([]);
  const [dailyLogs, setDailyLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch weekly schedule data
  useEffect(() => {
    const fetchWeeklyData = async () => {
      try {
        setLoading(true);
        
        // Lấy dữ liệu kế hoạch tuần
        const weeklyResponse = await api.get('/GoalPlanWeeklyReduction/generate-weekly-schedule');
        console.log('Weekly Schedule API Response:', weeklyResponse.data);
        setWeeklyData(weeklyResponse.data);
        
        // Lấy dữ liệu daily reductions từ CurrentGoal API
        try {
          const currentGoalResponse = await api.get('/CurrentGoal');
          console.log('Current Goal API Response:', currentGoalResponse.data);
          
          // Lấy dailyReductions từ response
          const dailyReductions = currentGoalResponse.data.dailyReductions || [];
          setDailyLogs(dailyReductions);
        } catch (dailyError) {
          console.warn('Could not fetch current goal data:', dailyError);
          // Không set error vì đây là optional data
        }
        
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

  // Tính toán tiến trình dựa trên số điếu thuốc hút trong tuần
  const generateWeeklyProgressData = () => {
    if (!weeklyData.length) return [];
    
    return weeklyData.map((week) => {
      const startDate = new Date(week.startDate);
      const endDate = new Date(week.endDate);
      const today = new Date();
      
      // Tính tổng số điếu thuốc đã hút trong tuần này (từ CurrentGoal API)
      const weekCigarettesSmoked = calculateWeekCigarettes(week.startDate, week.endDate);
      
      // Mục tiêu giảm xuống còn X điếu/ngày cho cả tuần
      const dailyTarget = week.cigarettesReduced; // Mục tiêu điếu/ngày từ GoalPlan
      const weeklyTarget = dailyTarget * 7; // Mục tiêu cho cả tuần (7 ngày)
      
      // Tính phần trăm hoàn thành mục tiêu
      let progressPercent = 0;
      if (weeklyTarget > 0) {
        // Nếu có mục tiêu cụ thể
        // Progress = Mức độ tuân thủ mục tiêu (hút ít hơn hoặc bằng mục tiêu)
        if (weekCigarettesSmoked <= weeklyTarget) {
          // Đạt mục tiêu hoặc tốt hơn
          progressPercent = 100;
        } else {
          // Chưa đạt mục tiêu, tính tỷ lệ
          const overTarget = weekCigarettesSmoked - weeklyTarget;
          const maxOver = weeklyTarget; // Giả sử tối đa vượt quá 100%
          progressPercent = Math.max(0, 100 - (overTarget / maxOver * 100));
        }
      } else {
        // Nếu mục tiêu = 0 (không hút thuốc)
        if (weekCigarettesSmoked === 0) {
          progressPercent = 100; // Hoàn hảo
        } else {
          // Tính theo thời gian đã trải qua
          const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
          const passedDays = today > endDate ? totalDays : Math.max(0, Math.ceil((today - startDate) / (1000 * 60 * 60 * 24)) + 1);
          progressPercent = Math.min((passedDays / totalDays) * 100, 100);
        }
      }
      
      // Debug log
      console.log(`Week ${week.weekNumber}:`, {
        startDate: week.startDate,
        endDate: week.endDate,
        dailyTarget: dailyTarget,
        weeklyTarget: weeklyTarget,
        weekCigarettesSmoked: weekCigarettesSmoked,
        progressPercent: Math.round(progressPercent),
        isActive: today >= startDate && today <= endDate,
        status: weekCigarettesSmoked <= weeklyTarget ? 'Đạt mục tiêu' : 'Chưa đạt mục tiêu'
      });
      
      return {
        weekNumber: week.weekNumber,
        targetReduction: week.cigarettesReduced,
        dailyTarget: dailyTarget,
        weeklyTarget: weeklyTarget,
        actualSmoked: weekCigarettesSmoked,
        startDate: week.startDate,
        endDate: week.endDate,
        progressPercent: progressPercent,
        isCompleted: progressPercent >= 100,
        isCurrent: today >= startDate && today <= endDate,
        isOnTrack: weekCigarettesSmoked <= weeklyTarget
      };
    }).sort((a, b) => a.weekNumber - b.weekNumber);
  };

  // Hàm tính tổng số điếu thuốc hút trong khoảng thời gian
  const calculateWeekCigarettes = (startDate, endDate) => {
    if (!dailyLogs.length) return 0;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return dailyLogs
      .filter(reduction => {
        const reductionDate = new Date(reduction.date);
        return reductionDate >= start && reductionDate <= end;
      })
      .reduce((total, reduction) => total + (reduction.cigarettesReduced || 0), 0);
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
                    {week.dailyTarget > 0 
                      ? `Mục tiêu: ${week.dailyTarget} điếu/ngày (${week.weeklyTarget} điếu/tuần)` 
                      : 'Mục tiêu: Duy trì không hút thuốc'
                    }
                  </div>
                  <div className="week-actual">
                    <small className={`${week.isOnTrack ? 'text-success' : 'text-danger'}`}>
                      Đã hút: {week.actualSmoked} điếu
                      {week.weeklyTarget > 0 && ` / ${week.weeklyTarget} điếu`}
                      {week.weeklyTarget > 0 && (
                        <span className="ms-1">
                          {week.isOnTrack ? '✓ Đạt mục tiêu' : '⚠ Vượt mục tiêu'}
                        </span>
                      )}
                    </small>
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
