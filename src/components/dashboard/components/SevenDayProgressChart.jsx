import React from 'react';

const SevenDayProgressChart = ({ progressLogs }) => {
  // Tạo dữ liệu cho 7 ngày gần nhất
  const generateSevenDayData = () => {
    const data = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateString = date.toISOString().slice(0, 10);
      const dayName = date.toLocaleDateString('vi-VN', { weekday: 'short' });
      
      // Tìm log cho ngày này
      const dayLog = progressLogs.find(log => 
        (log.logDate || log.date) === dateString
      );
      
      data.push({
        day: dayName,
        date: dateString,
        cigarettes: dayLog ? (dayLog.cigarettesSmoked || 0) : 0,
        target: 0, // Mục tiêu là 0 điếu
        achieved: dayLog ? (dayLog.cigarettesSmoked === 0) : false
      });
    }
    
    return data;
  };

  const data = generateSevenDayData();
  const maxCigarettes = Math.max(...data.map(d => d.cigarettes), 2);

  return (
    <div className="section-card">
      <div className="card-body">
        <h5 className="card-title mb-4">
          <i className="fas fa-chart-line me-2"></i>
          Tiến trình 7 ngày gần nhất
        </h5>
        <div className="text-center mb-3">
          <small className="text-muted">Số điếu thuốc theo ngày</small>
        </div>
        
        <div className="seven-day-chart">
          <div className="chart-container">
            {data.map((item, index) => (
              <div key={index} className="chart-day">
                <div className="chart-bar-container">
                  <div 
                    className={`chart-bar ${item.achieved ? 'bar-success' : 'bar-danger'}`}
                    style={{
                      height: item.cigarettes === 0 ? '4px' : `${(item.cigarettes / maxCigarettes) * 100}%`,
                      minHeight: '4px'
                    }}
                  >
                    {item.cigarettes > 0 && (
                      <span className="bar-value">{item.cigarettes}</span>
                    )}
                    {item.achieved && (
                      <span className="achievement-icon">
                        <i className="fas fa-check"></i>
                      </span>
                    )}
                  </div>
                </div>
                <div className="chart-day-label">
                  <div className="day-name">{item.day}</div>
                  <div className="day-date">{new Date(item.date).getDate()}</div>
                  {item.achieved && (
                    <div className="success-indicator">
                      <small className="text-success">Thành công</small>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="chart-legend mt-3">
            <div className="d-flex justify-content-center gap-4">
              <div className="legend-item">
                <span className="legend-color bar-success"></span>
                <small>Không hút thuốc</small>
              </div>
              <div className="legend-item">
                <span className="legend-color bar-danger"></span>
                <small>Có hút thuốc</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SevenDayProgressChart;
