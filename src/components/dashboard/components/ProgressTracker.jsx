// Progress tracking component
import React, { useState } from "react";
import { toast } from "react-toastify";
import { Line } from "react-chartjs-2";
import api from "../../../api/axios";
import { calculateGoalProgress, getGoalDays } from "../utils/dashboardUtils";
import { COMMUNITY_AVG } from "../constants/dashboardConstants";

const ProgressTracker = ({
  progress,
  currentGoal,
  plan,
  progressLogs,
  setProgressLogs,
  setCurrentGoal,
  pricePerPack,
  setPricePerPack,
  cigarettesPerPack,
  setCigarettesPerPack,
}) => {
  const [todayCigarettes, setTodayCigarettes] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [journalEntry, setJournalEntry] = useState("");
  const [journalDate, setJournalDate] = useState(() => {
    return new Date().toISOString().slice(0, 10);
  });

  // Xử lý ghi nhận tiến trình
  const handleSubmitProgress = async (e) => {
    e.preventDefault();
    const existed = progressLogs.find((j) => (j.logDate || j.date) === journalDate);
    if (existed) {
      toast.error(
        "Bạn đã ghi nhật ký cho ngày hôm nay. Hãy sửa hoặc xóa để ghi lại."
      );
      return;
    }

    if (
      isNaN(todayCigarettes) ||
      todayCigarettes === "" ||
      todayCigarettes < 0
    ) {
      toast.error("Số điếu thuốc không hợp lệ!");
      return;
    }
    if (isNaN(pricePerPack) || pricePerPack < 1000) {
      toast.error("Giá tiền/bao không hợp lệ!");
      return;
    }
    if (isNaN(cigarettesPerPack) || cigarettesPerPack < 1) {
      toast.error("Số điếu/bao không hợp lệ!");
      return;
    }

    const body = {
      logDate: journalDate,
      cigarettesSmoked: Number(todayCigarettes),
      pricePerPack: Number(pricePerPack),
      cigarettesPerPack: Number(cigarettesPerPack),
      mood: "",
      notes: journalEntry,
    };

    try {
      await api.post("/ProgressLog/CreateProgress-log", body);
      toast.success("Đã ghi nhận tiến trình!");
      setShowForm(false);
      setTodayCigarettes("");
      const res = await api.get("/ProgressLog/GetProgress-logs");
      setProgressLogs(res.data);

      // Reload currentGoal
      const goalRes = await api.get("/CurrentGoal");
      setCurrentGoal(goalRes.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi kết nối API!");
    }
  };

  // Tính phần trăm hoàn thành mục tiêu
  const percent = calculateGoalProgress(currentGoal, plan);

  // Tính strokeDashoffset cho vòng tròn SVG
  const circleLength = 2 * Math.PI * 40; // r=40
  const offset = circleLength * (1 - percent / 100);

  // Chart data
  const chartLabels = progressLogs.map((j) => j.logDate || j.date);
  const chartData = progressLogs.map((j) => j.cigarettesSmoked);

  const chartConfig = {
    labels: chartLabels,
    datasets: [
      {
        label: "Số điếu thuốc/ngày",
        data: chartData,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Biểu đồ tiến trình cai thuốc",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="progress-tracker">
      {/* Progress Overview */}
      <div className="row mb-4">
        {/* Progress Circle */}
        <div className="col-md-4">
          <div className="card text-center">
            <div className="card-body">
              <h5 className="card-title">Tiến trình tổng quan</h5>
              <div className="position-relative d-inline-block">
                <svg width="120" height="120" className="progress-ring">
                  <circle
                    cx="60"
                    cy="60"
                    r="40"
                    stroke="#e9ecef"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="40"
                    stroke="#28a745"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={circleLength}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    transform="rotate(-90 60 60)"
                    style={{
                      transition: "stroke-dashoffset 0.5s ease-in-out",
                    }}
                  />
                </svg>
                <div className="position-absolute top-50 start-50 translate-middle">
                  <h3 className="mb-0 text-success">{percent}%</h3>
                  <small className="text-muted">Hoàn thành</small>
                </div>
              </div>
              <p className="mt-3 mb-0">Mục tiêu: {getGoalDays(plan)} ngày</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="col-md-8">
          <div className="row">
            <div className="col-md-4">
              <div className="card bg-primary text-white">
                <div className="card-body text-center">
                  <i className="fas fa-calendar-check fa-2x mb-2" />
                  <h4>{currentGoal?.smokeFreeDays || progress.daysNoSmoke}</h4>
                  <p className="mb-0">Ngày không hút</p>
                  <small>Trung bình cộng đồng: {COMMUNITY_AVG.daysNoSmoke}</small>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card bg-success text-white">
                <div className="card-body text-center">
                  <i className="fas fa-piggy-bank fa-2x mb-2" />
                  <h4>{(progress.moneySaved || 0).toLocaleString()}đ</h4>
                  <p className="mb-0">Tiền tiết kiệm</p>
                  <small>Trung bình cộng đồng: {COMMUNITY_AVG.moneySaved.toLocaleString()}đ</small>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card bg-info text-white">
                <div className="card-body text-center">
                  <i className="fas fa-heart fa-2x mb-2" />
                  <h4>{progress.health || 0}%</h4>
                  <p className="mb-0">Sức khỏe cải thiện</p>
                  <small>Trung bình cộng đồng: {COMMUNITY_AVG.health}%</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Progress Form */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <i className="fas fa-plus-circle me-2" />
                Ghi nhận tiến trình hôm nay
              </h5>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setShowForm(!showForm)}
              >
                {showForm ? "Đóng" : "Thêm"}
              </button>
            </div>
            {showForm && (
              <div className="card-body">
                <form onSubmit={handleSubmitProgress}>
                  <div className="row">
                    <div className="col-md-3">
                      <label className="form-label">Ngày</label>
                      <input
                        type="date"
                        className="form-control"
                        value={journalDate}
                        onChange={(e) => setJournalDate(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Số điếu hút</label>
                      <input
                        type="number"
                        className="form-control"
                        value={todayCigarettes}
                        onChange={(e) => setTodayCigarettes(e.target.value)}
                        min="0"
                        required
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Giá/bao (VNĐ)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={pricePerPack}
                        onChange={(e) => setPricePerPack(e.target.value)}
                        min="1000"
                        required
                      />
                    </div>
                    <div className="col-md-3">
                      <label className="form-label">Số điếu/bao</label>
                      <input
                        type="number"
                        className="form-control"
                        value={cigarettesPerPack}
                        onChange={(e) => setCigarettesPerPack(e.target.value)}
                        min="1"
                        required
                      />
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-12">
                      <label className="form-label">Ghi chú</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        value={journalEntry}
                        onChange={(e) => setJournalEntry(e.target.value)}
                        placeholder="Ghi chú về cảm xúc, hoàn cảnh..."
                      />
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-12">
                      <button type="submit" className="btn btn-success me-2">
                        Lưu tiến trình
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => setShowForm(false)}
                      >
                        Hủy
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Progress Chart */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="fas fa-chart-line me-2" />
                Biểu đồ tiến trình
              </h5>
            </div>
            <div className="card-body">
              {progressLogs.length > 0 ? (
                <Line data={chartConfig} options={chartOptions} />
              ) : (
                <div className="text-center py-5">
                  <i className="fas fa-chart-line text-muted" style={{ fontSize: "4rem" }} />
                  <h4 className="mt-3 text-muted">Chưa có dữ liệu</h4>
                  <p className="text-muted">
                    Hãy ghi nhận tiến trình hàng ngày để xem biểu đồ
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;
