import React, { useState, useEffect } from 'react';
import api from '../../../api/axios';

const SevenDayProgressChart = () => {
  const [weeklyData, setWeeklyData] = useState([]);
  const [memberProfile, setMemberProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch weekly schedule data and member profile
  useEffect(() => {
    const fetchWeeklyData = async () => {
      try {
        setLoading(true);
        
        // Lấy dữ liệu kế hoạch tuần (đã có totalCigarettes)
        const weeklyResponse = await api.get('/GoalPlanWeeklyReduction/generate-weekly-schedule');
        console.log('Weekly Schedule API Response:', weeklyResponse.data);
        setWeeklyData(weeklyResponse.data);

        // Lấy dữ liệu member profile để lấy cigarettesSmoked
        try {
          const memberProfileResponse = await api.get('/MemberProfile/GetMyMemberProfile');
          console.log('Member Profile API Response:', memberProfileResponse.data);
          setMemberProfile(memberProfileResponse.data);
        } catch (profileError) {
          console.warn('Could not fetch member profile data:', profileError);
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

  // Hàm lấy mục tiêu tuần từ MemberProfile (số điếu cần cai mỗi ngày)
  const getWeekTargetFromMemberProfile = (startDate, endDate) => {
    // Tính số ngày thực tế trong tuần từ startDate và endDate
    const start = new Date(startDate);
    const end = new Date(endDate);
    const daysInWeek = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    
    if (!memberProfile || !memberProfile.cigarettesSmoked) {
      return { totalWeek: 0, averageDaily: 0, daysInWeek: daysInWeek };
    }
    
    // Lấy cigarettesSmoked từ MemberProfile (số điếu cần cai mỗi ngày)
    const dailyCigarettesToQuit = memberProfile.cigarettesSmoked || 0;
    
    // Tính tổng mục tiêu cai thuốc trong tuần: cigarettesSmoked * số ngày thực tế trong tuần
    const totalWeekTarget = dailyCigarettesToQuit * daysInWeek;
    
    return {
      totalWeek: totalWeekTarget,
      averageDaily: dailyCigarettesToQuit,
      daysInWeek: daysInWeek
    };
  };

  // Tính toán tiến trình dựa trên số điếu thuốc hút trong tuần
  const generateWeeklyProgressData = () => {
    if (!weeklyData.length) return [];
    
    return weeklyData.map((week, index) => {
      const startDate = new Date(week.startDate);
      const endDate = new Date(week.endDate);
      const today = new Date();
      
      // Kiểm tra điều kiện tính phần trăm cho tuần
      let shouldCalculateProgress = true;
      
      // Nếu không phải tuần đầu tiên, kiểm tra tuần trước đã qua ngày kết thúc chưa
      if (index > 0) {
        const previousWeek = weeklyData[index - 1];
        const previousEndDate = new Date(previousWeek.endDate);
        
        // Chỉ tính phần trăm nếu đã qua ngày kết thúc của tuần trước
        shouldCalculateProgress = today > previousEndDate;
      }
      
      // Tính số ngày thực tế trong tuần từ startDate và endDate của API
      const daysInWeek = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
      
      // Chỉ lấy cigarettesSmoked từ MemberProfile và tính số điếu thuốc dự kiến trong tuần
      const cigarettesPerDay = memberProfile?.cigarettesSmoked || 0;
      const expectedCigarettesInWeek = cigarettesPerDay * daysInWeek;
      
      // Sử dụng totalCigarettes từ API (tổng số điếu thuốc đã hút trong tuần thực tế)
      const weekCigarettesSmoked = week.totalCigarettes || 0;
      
      // Lấy mục tiêu thực tế từ MemberProfile cho tuần này
      const weekTarget = getWeekTargetFromMemberProfile(week.startDate, week.endDate);
      const weeklyTarget = weekTarget.totalWeek;
      
      // Tính phần trăm đã hút và đã cai theo công thức mới
      let percentSmoked = 0;
      let percentQuit = 0;
      
      // Chỉ tính phần trăm nếu thỏa mãn điều kiện
      if (shouldCalculateProgress) {
        if (weeklyTarget > 0) {
          // % đã hút = (Số điếu đã hút / Tổng số điếu mục tiêu) × 100
          percentSmoked = Math.round((weekCigarettesSmoked / weeklyTarget) * 100);
          
          // % đã cai = ((Tổng số điếu - Số điếu đã hút) / Tổng số điếu) × 100
          const cigarettesQuit = Math.max(0, weeklyTarget - weekCigarettesSmoked);
          percentQuit = Math.round((cigarettesQuit / weeklyTarget) * 100);
          
          // Đảm bảo tổng không vượt quá 100%
          if (percentSmoked > 100) {
            percentSmoked = 100;
            percentQuit = 0;
          } else {
            percentQuit = 100 - percentSmoked;
          }
        } else {
          // Nếu không có mục tiêu, mặc định là 100% cai thuốc nếu không hút
          if (weekCigarettesSmoked === 0) {
            percentSmoked = 0;
            percentQuit = 100;
          } else {
            percentSmoked = 100;
            percentQuit = 0;
          }
        }
      } else {
        // Nếu chưa đến lúc tính phần trăm, hiển thị 0%
        percentSmoked = 0;
        percentQuit = 0;
      }
      
      // Đảm bảo phần trăm luôn trong khoảng 0-100
      percentSmoked = Math.max(0, Math.min(100, percentSmoked));
      percentQuit = Math.max(0, Math.min(100, percentQuit));
      
      // Tính trạng thái cai thuốc dựa trên % đã cai
      let quitStatus = 'Chưa cai được';
      let statusColor = 'danger';
      
      if (!shouldCalculateProgress && index > 0) {
        // Nếu chưa đến lúc tính phần trăm cho tuần này
        quitStatus = 'Tuần mới chưa bắt đầu';
        statusColor = 'secondary';
      } else if (percentQuit === 100) {
        quitStatus = 'Hoàn toàn cai thuốc';
        statusColor = 'success';
      } else if (percentQuit >= 70) {
        quitStatus = 'Cai thuốc rất tốt';
        statusColor = 'success';
      } else if (percentQuit >= 50) {
        quitStatus = 'Đang cai thuốc tốt';
        statusColor = 'warning';
      } else if (percentQuit > 0) {
        quitStatus = 'Bắt đầu cai thuốc';
        statusColor = 'info';
      }
      
      // Debug log
      console.log(`Week ${week.weekNumber}:`, {
        startDate: week.startDate,
        endDate: week.endDate,
        daysInWeek: daysInWeek,
        cigarettesPerDay: cigarettesPerDay,
        expectedCigarettesInWeek: expectedCigarettesInWeek,
        dailyQuitTarget: weekTarget.averageDaily,
        weeklyQuitTarget: weeklyTarget,
        weekCigarettesSmoked: weekCigarettesSmoked,
        cigarettesReduced: weeklyTarget - weekCigarettesSmoked,
        shouldCalculateProgress: shouldCalculateProgress,
        percentSmoked: percentSmoked,
        percentQuit: percentQuit,
        quitStatus: quitStatus,
        isActive: today >= startDate && today <= endDate
      });
      
      return {
        weekNumber: week.weekNumber,
        dailyTarget: weekTarget.averageDaily,
        weeklyTarget: weeklyTarget,
        actualSmoked: weekCigarettesSmoked,
        expectedSmoked: expectedCigarettesInWeek,
        cigarettesPerDay: cigarettesPerDay,
        startDate: week.startDate,
        endDate: week.endDate,
        daysInWeek: daysInWeek,
        percentSmoked: percentSmoked,
        percentQuit: percentQuit,
        quitStatus: quitStatus,
        statusColor: statusColor,
        isCompleted: percentQuit === 100,
        isCurrent: today >= startDate && today <= endDate,
        isOnTrack: percentQuit >= 50, // Coi như đang on track nếu cai được >= 50%
        cigarettesReduced: Math.max(0, weeklyTarget - weekCigarettesSmoked)
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
                    {week.dailyTarget > 0 
                      ? `Muốn cai thuốc lá: ${week.dailyTarget} điếu/ngày (${week.weeklyTarget} điếu/${week.daysInWeek} ngày)` 
                      : 'Mục tiêu: Duy trì không hút thuốc'
                    }
                  </div>
                  <div className="week-actual">
                    <small className={`text-${week.statusColor}`}>
                      <strong>Đã hút: {week.actualSmoked} điếu</strong>
                      {week.cigarettesReduced > 0 && (
                        <span className="ms-1">
                          | Cần cai: {week.cigarettesReduced} điếu
                        </span>
                      )}
                    </small>
                    <div>
                      <small className={`text-${week.statusColor} fw-bold`}>
                        {week.percentQuit === 100 ? '🎉' : 
                         week.percentQuit >= 70 ? '✅' : 
                         week.percentQuit >= 50 ? '⚡' : 
                         week.percentQuit > 0 ? '🌱' : '⚠️'} {week.quitStatus}
                      </small>
                    </div>
                  </div>
                </div>
                <div className="week-date">
                  {new Date(week.startDate).toLocaleDateString('vi-VN', { 
                    day: '2-digit', 
                    month: '2-digit'
                  })} - {new Date(week.endDate).toLocaleDateString('vi-VN', { 
                    day: '2-digit', 
                    month: '2-digit',
                    year: 'numeric'
                  })}
                </div>
              </div>
              
              <div className="progress-bar-container">
                <div className="progress-bar-background">
                  {/* Thanh tiến độ đã cai (màu xanh) */}
                  <div 
                    className="progress-bar-fill bg-success"
                    style={{ width: `${week.percentQuit}%` }}
                    title={`Đã cai: ${week.percentQuit}%`}
                  ></div>
                  {/* Thanh tiến độ đã hút (màu đỏ) */}
                  <div 
                    className="progress-bar-fill bg-danger"
                    style={{ 
                      width: `${week.percentSmoked}%`,
                      marginLeft: `${week.percentQuit}%`,
                      position: 'absolute',
                      top: 0,
                      height: '100%'
                    }}
                    title={`Đã hút: ${week.percentSmoked}%`}
                  ></div>
                </div>
                <div className="progress-percentage">
                  <div className="d-flex justify-content-between">
                    <small className="text-success">
                      <strong>Cai: {week.percentQuit}%</strong>
                    </small>
                    <small className="text-danger">
                      <strong>Hút: {week.percentSmoked}%</strong>
                    </small>
                  </div>
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
        
        {/* Thông báo về các tuần chưa tính phần trăm */}
        {weeklyProgress.some(week => week.quitStatus === 'Tuần mới chưa bắt đầu') && (
          <div className="alert alert-info mt-3">
            <i className="fas fa-clock me-2"></i>
            <strong>Lưu ý:</strong> Các tuần có trạng thái "Tuần mới chưa bắt đầu" sẽ bắt đầu tính phần trăm tiến độ 
            khi đã qua ngày kết thúc của tuần trước đó.
          </div>
        )}
        
        {/* Thêm legend giải thích */}
        <div className="mt-4">
          <h6 className="mb-3">Thang đánh giá tiến trình cai thuốc:</h6>
          <div className="row">
            <div className="col-md-3 mb-2">
              <small className="d-block">
                <span className="badge bg-success me-1">100%</span>
                🎉 Hoàn toàn cai thuốc
              </small>
            </div>
            <div className="col-md-3 mb-2">
              <small className="d-block">
                <span className="badge bg-success me-1">70-99%</span>
                ✅ Cai thuốc rất tốt
              </small>
            </div>
            <div className="col-md-3 mb-2">
              <small className="d-block">
                <span className="badge bg-warning me-1">50-69%</span>
                ⚡ Đang cai thuốc tốt
              </small>
            </div>
            <div className="col-md-3 mb-2">
              <small className="d-block">
                <span className="badge bg-info me-1">1-49%</span>
                🌱 Bắt đầu cai thuốc
              </small>
            </div>
          </div>
          <div className="mt-3">
            <h6 className="mb-2">Thanh tiến độ:</h6>
            <div className="d-flex align-items-center mb-2">
              <div className="progress me-3" style={{ width: '100px', height: '20px' }}>
                <div className="progress-bar bg-success" style={{ width: '60%' }}></div>
                <div className="progress-bar bg-danger" style={{ width: '40%' }}></div>
              </div>
              <small>
                <span className="text-success me-2">■ % Đã cai (xanh)</span>
                <span className="text-danger">■ % Đã hút (đỏ)</span>
              </small>
            </div>
          </div>
          <div className="mt-2">
            <small className="text-muted">
              <i className="fas fa-info-circle me-1"></i>
              % Đã cai = ((Tổng mục tiêu - Số điếu đã hút) / Tổng mục tiêu) × 100<br/>
              % Đã hút = (Số điếu đã hút / Tổng mục tiêu) × 100
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SevenDayProgressChart;
