import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const ProgressTab = ({ progressLogs, currentGoal, plan }) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState('7days');
  const [selectedMetric, setSelectedMetric] = useState('mood');

  // Lọc dữ liệu theo khoảng thời gian
  const getFilteredData = () => {
    const now = new Date();
    let daysBack = 7;
    
    switch (selectedTimeRange) {
      case '7days':
        daysBack = 7;
        break;
      case '30days':
        daysBack = 30;
        break;
      case '90days':
        daysBack = 90;
        break;
      default:
        daysBack = 7;
    }

    const startDate = new Date(now.getTime() - (daysBack * 24 * 60 * 60 * 1000));
    
    return progressLogs.filter(log => {
      const logDate = new Date(log.date || log.logDate);
      return logDate >= startDate;
    }).sort((a, b) => new Date(a.date || a.logDate) - new Date(b.date || b.logDate));
  };

  const filteredData = getFilteredData();

  // Tạo dữ liệu cho biểu đồ tâm trạng
  const getMoodChartData = () => {
    const moodMapping = {
      'rat_vui': 5,
      'vui': 4,
      'binh_thuong': 3,
      'buon': 2,
      'rat_buon': 1
    };

    const labels = filteredData.map(log => {
      const date = new Date(log.date || log.logDate);
      return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
    });

    const data = filteredData.map(log => moodMapping[log.mood] || 3);

    return {
      labels,
      datasets: [
        {
          label: 'Tâm trạng (1-5)',
          data,
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.1,
          fill: true,
        },
      ],
    };
  };

  // Tạo dữ liệu cho biểu đồ số điếu thuốc
  const getCigaretteChartData = () => {
    const labels = filteredData.map(log => {
      const date = new Date(log.date || log.logDate);
      return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
    });

    const data = filteredData.map(log => log.cigarettesSmoked || 0);

    return {
      labels,
      datasets: [
        {
          label: 'Số điếu thuốc',
          data,
          backgroundColor: data.map(value => 
            value === 0 ? 'rgba(75, 192, 192, 0.8)' : 
            value <= 5 ? 'rgba(255, 206, 86, 0.8)' : 
            'rgba(255, 99, 132, 0.8)'
          ),
          borderColor: data.map(value => 
            value === 0 ? 'rgb(75, 192, 192)' : 
            value <= 5 ? 'rgb(255, 206, 86)' : 
            'rgb(255, 99, 132)'
          ),
          borderWidth: 1,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: selectedMetric === 'mood' ? 'Biểu đồ Tâm trạng' : 'Biểu đồ Số điếu thuốc',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: selectedMetric === 'mood' ? 5 : undefined,
      },
    },
  };

  // Tính toán thống kê
  const getStatistics = () => {
    if (filteredData.length === 0) return null;

    const totalCigarettes = filteredData.reduce((sum, log) => sum + (log.cigarettesSmoked || 0), 0);
    const averageCigarettes = totalCigarettes / filteredData.length;
    const smokingFreeDays = filteredData.filter(log => (log.cigarettesSmoked || 0) === 0).length;
    const smokingFreePercentage = (smokingFreeDays / filteredData.length) * 100;
    
    const moodValues = filteredData.map(log => {
      const moodMapping = {
        'rat_vui': 5,
        'vui': 4,  
        'binh_thuong': 3,
        'buon': 2,
        'rat_buon': 1
      };
      return moodMapping[log.mood] || 3;
    });
    const averageMood = moodValues.reduce((sum, mood) => sum + mood, 0) / moodValues.length;

    return {
      totalCigarettes,
      averageCigarettes,
      smokingFreeDays,
      smokingFreePercentage,
      averageMood,
      totalDays: filteredData.length
    };
  };

  const statistics = getStatistics();

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="dashboard-header text-white p-4 mb-4">
        <div className="content">
          <div className="text-center">
            <h3 className="mb-1">
              <i className="fas fa-chart-line me-2"></i>
              Tiến trình chi tiết
            </h3>
            <p className="mb-0 opacity-75">
              Theo dõi chi tiết quá trình cai thuốc của bạn
            </p>
          </div>
        </div>
      </div>

      {/* Bộ lọc */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card progress-filter-card">
            <div className="card-body">
              <h6 className="card-title">Khoảng thời gian</h6>
              <div className="btn-group w-100 time-range-selector" role="group">
                <button
                  type="button"
                  className={`btn ${selectedTimeRange === '7days' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setSelectedTimeRange('7days')}
                >
                  7 ngày
                </button>
                <button
                  type="button"
                  className={`btn ${selectedTimeRange === '30days' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setSelectedTimeRange('30days')}
                >
                  30 ngày
                </button>
                <button
                  type="button"
                  className={`btn ${selectedTimeRange === '90days' ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={() => setSelectedTimeRange('90days')}
                >
                  90 ngày
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card progress-filter-card">
            <div className="card-body">
              <h6 className="card-title">Chỉ số theo dõi</h6>
              <div className="btn-group w-100 metric-selector" role="group">
                <button
                  type="button"
                  className={`btn ${selectedMetric === 'mood' ? 'btn-success' : 'btn-outline-success'}`}
                  onClick={() => setSelectedMetric('mood')}
                >
                  Tâm trạng
                </button>
                <button
                  type="button"
                  className={`btn ${selectedMetric === 'cigarettes' ? 'btn-success' : 'btn-outline-success'}`}
                  onClick={() => setSelectedMetric('cigarettes')}
                >
                  Số điếu thuốc
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Thống kê tổng quan */}
      {statistics && (
        <div className="row g-3 mb-4">
          <div className="col-6 col-md-3">
            <div className="card progress-stats-card border-0 h-100">
              <div className="card-body text-center">
                <div className="icon-wrapper bg-success mx-auto mb-2">
                  <i className="fas fa-calendar-check text-white"></i>
                </div>
                <div className="fw-bold">Ngày không hút</div>
                <h4 className="text-success mb-0 fw-bold">{statistics.smokingFreeDays}</h4>
                <small className="text-muted">/{statistics.totalDays} ngày</small>
                <div className="mt-2">
                  <small className="text-success">{statistics.smokingFreePercentage.toFixed(1)}% thành công</small>
                </div>
              </div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card progress-stats-card border-0 h-100">
              <div className="card-body text-center">
                <div className="icon-wrapper bg-warning mx-auto mb-2">
                  <i className="fas fa-smoking text-white"></i>
                </div>
                <div className="fw-bold">Trung bình/ngày</div>
                <h4 className="text-warning mb-0 fw-bold">{statistics.averageCigarettes.toFixed(1)}</h4>
                <small className="text-muted">điếu thuốc</small>
                <div className="mt-2">
                  <small className="text-warning">Tổng: {statistics.totalCigarettes} điếu</small>
                </div>
              </div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card progress-stats-card border-0 h-100">
              <div className="card-body text-center">
                <div className="icon-wrapper bg-info mx-auto mb-2">
                  <i className="fas fa-smile text-white"></i>
                </div>
                <div className="fw-bold">Tâm trạng trung bình</div>
                <h4 className="text-info mb-0 fw-bold">{statistics.averageMood.toFixed(1)}</h4>
                <small className="text-muted">/5 điểm</small>
                <div className="mt-2">
                  <small className="text-info">
                    {statistics.averageMood >= 4 ? 'Tích cực' : 
                     statistics.averageMood >= 3 ? 'Ổn định' : 'Cần cải thiện'}
                  </small>
                </div>
              </div>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card progress-stats-card border-0 h-100">
              <div className="card-body text-center">
                <div className="icon-wrapper bg-primary mx-auto mb-2">
                  <i className="fas fa-chart-line text-white"></i>
                </div>
                <div className="fw-bold">Tổng số ngày</div>
                <h4 className="text-primary mb-0 fw-bold">{statistics.totalDays}</h4>
                <small className="text-muted">đã ghi nhận</small>
                <div className="mt-2">
                  <small className="text-primary">Trong {selectedTimeRange.replace('days', ' ngày')}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Biểu đồ */}
      <div className="progress-chart-container mb-4">
        <div style={{ height: '400px' }}>
          {filteredData.length > 0 ? (
            selectedMetric === 'mood' ? (
              <Line data={getMoodChartData()} options={chartOptions} />
            ) : (
              <Bar data={getCigaretteChartData()} options={chartOptions} />
            )
          ) : (
            <div className="empty-chart-state">
              <div className="text-center">
                <i className="fas fa-chart-line fa-3x text-muted mb-3"></i>
                <h5 className="text-muted">Chưa có dữ liệu</h5>
                <p className="text-muted">Hãy bắt đầu ghi nhận tiến trình hàng ngày để xem biểu đồ</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Danh sách chi tiết */}
      {filteredData.length > 0 && (
        <div className="progress-table-container">
          <div className="card-body">
            <h5 className="card-title mb-3">
              <i className="fas fa-list me-2"></i>
              Chi tiết từng ngày
            </h5>
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Ngày</th>
                    <th>Số điếu thuốc</th>
                    <th>Tâm trạng</th>
                    <th>Yếu tố kích hoạt</th>
                    <th>Triệu chứng</th>
                    <th>Ghi chú</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((log, index) => {
                    const date = new Date(log.date || log.logDate);
                    const moodLabels = {
                      'rat_vui': { label: 'Rất vui', emoji: '😊', color: 'success' },
                      'vui': { label: 'Vui', emoji: '😄', color: 'success' },
                      'binh_thuong': { label: 'Bình thường', emoji: '😐', color: 'warning' },
                      'buon': { label: 'Buồn', emoji: '😟', color: 'warning' },
                      'rat_buon': { label: 'Rất buồn', emoji: '😢', color: 'danger' }
                    };
                    const moodInfo = moodLabels[log.mood] || { label: 'Không xác định', emoji: '❓', color: 'secondary' };
                    
                    return (
                      <tr key={index}>
                        <td>{date.toLocaleDateString('vi-VN')}</td>
                        <td>
                          <span className={`badge ${(log.cigarettesSmoked || 0) === 0 ? 'progress-badge-success' : (log.cigarettesSmoked || 0) <= 5 ? 'progress-badge-warning' : 'progress-badge-danger'}`}>
                            {log.cigarettesSmoked || 0} điếu
                          </span>
                        </td>
                        <td>
                          <span className={`badge bg-${moodInfo.color}`}>
                            {moodInfo.emoji} {moodInfo.label}
                          </span>
                        </td>
                        <td>{(log.triggers || []).length} yếu tố</td>
                        <td>{(log.symptoms || []).length} triệu chứng</td>
                        <td>
                          {log.note ? (
                            <span className="text-truncate" style={{ maxWidth: '150px', display: 'inline-block' }} title={log.note}>
                              {log.note}
                            </span>
                          ) : (
                            <span className="text-muted">Không có</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressTab;
