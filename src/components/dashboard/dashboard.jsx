// Refactored Dashboard - Main component
import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import api from "../../api/axios";
import "../../css/Dashboard.css";

// Import separated components
import BadgeComponents from "./components/BadgeComponents";
import ProgressTracker from "./components/ProgressTracker";
import JournalManager from "./components/JournalManager";
import ProfileManager from "./components/ProfileManager";
import AppointmentManager from "./components/AppointmentManager";
import NotificationManager from "./components/NotificationManager";
import SevenDayProgressChart from "./components/SevenDayProgressChart";
import SystemReportForm from "../common/SystemReportForm";
import NotificationHistory from "./NotificationHistory";
import PlanTabNew from "./PlanTabNew";
import ProgressTab from "./ProgressTab";

// Import hooks and utils
import { useDashboardData } from "./hooks/useDashboardData";
import { 
  safeParse, 
  getAchievedBadges, 
  sendBrowserNotification,
  calculateProgress,
  calculateGoalProgress 
} from "./utils/dashboardUtils";
import { TABS, COMMUNITY_AVG } from "./constants/dashboardConstants";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  // Use custom hook for data management
  const {
    loading,
    memberProfile,
    smokingStatus,
    quitAttempts,
    experienceLevel,
    previousAttempts,
    cigarettesPerPack,
    appointments,
    coachList,
    planHistory,
    achievedBadges,
    hasMembership,
    progressLogs,
    progress,
    plan,
    currentGoal,
    setMemberProfile,
    setSmokingStatus,
    setQuitAttempts,
    setExperienceLevel,
    setPreviousAttempts,
    setCigarettesPerPack,
    setAppointments,
    setCoachList,
    setPlanHistory,
    setAchievedBadges,
    setProgressLogs,
    setProgress,
    setPlan,
    setCurrentGoal,
    fetchProfile,
    fetchAllData,
    fetchCoachList,
    fetchAppointments,
  } = useDashboardData();

  // Local state
  const [activeTab, setActiveTab] = useState("overview");
  const [journal, setJournal] = useState(() => safeParse("quitJournal", []));
  const [pricePerPack, setPricePerPack] = useState(() => localStorage.getItem("pricePerPack") || "");
  const [quitHistory] = useState(() => safeParse("quitHistory", []));

  // State cho mood tracking và trigger tracking
  const [todayMood, setTodayMood] = useState("");
  const [todayCigarettes, setTodayCigarettes] = useState("");
  const [selectedTriggers, setSelectedTriggers] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [todayNote, setTodayNote] = useState("");

  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  // Danh sách mood options
  const moodOptions = [
    { id: "rat_vui", label: "Rất vui", emoji: "😊", color: "#4CAF50" },
    { id: "vui", label: "Vui", emoji: "😄", color: "#8BC34A" },
    { id: "binh_thuong", label: "Bình thường", emoji: "😐", color: "#FFC107" },
    { id: "buon", label: "Buồn", emoji: "😟", color: "#FF9800" },
    { id: "rat_buon", label: "Rất buồn", emoji: "😢", color: "#F44336" }
  ];

  // Danh sách triggers
  const triggerOptions = [
    "Căng thẳng công việc", "Uống cà phé", "Sau bữa ăn",
    "Gặp bạn hút thuốc", "Nhậm chán", "Buồn chán",
    "Tức giận", "Lái xe", "Uống rượu bia"
  ];

  // Danh sách triệu chứng cai thuốc
  const symptomOptions = [
    "Cơn thèm thuốc", "Căng thẳng", "Lo lắng",
    "Khó tập trung", "Mất ngủ", "Dễ cáu gắt",
    "Đau đầu", "Ho khan", "Tăng cân"
  ];

  // Khi activeTab là appointment, fetch appointments
  useEffect(() => {
    if (activeTab === "appointment") {
      fetchAppointments();
    }
  }, [activeTab, fetchAppointments]);

  // Tính toán progress từ progressLogs
  useEffect(() => {
    if (progressLogs.length > 0) {
      const calculatedProgress = calculateProgress(progressLogs);
      setProgress(calculatedProgress);
    }
  }, [progressLogs, setProgress]);

  // Handle submit progress
  const handleSubmitDailyProgress = async (e) => {
    e.preventDefault();
    
    const todayDate = new Date().toISOString().slice(0, 10);
    const existed = progressLogs.find((log) => (log.logDate || log.date) === todayDate);
    
    if (existed) {
      toast.error("Bạn đã ghi nhật ký cho ngày hôm nay!");
      return;
    }

    if (isNaN(todayCigarettes) || todayCigarettes === "" || todayCigarettes < 0) {
      toast.error("Số điếu thuốc không hợp lệ!");
      return;
    }

    if (!todayMood) {
      toast.error("Vui lòng chọn tâm trạng hôm nay!");
      return;
    }

    try {
      const progressData = {
        date: todayDate,
        cigarettesSmoked: parseInt(todayCigarettes),
        mood: todayMood,
        triggers: selectedTriggers,
        symptoms: selectedSymptoms,
        note: todayNote
      };

      // Call API to save progress
      await api.post("/ProgressLog", progressData);
      
      // Update local state
      setProgressLogs([...progressLogs, progressData]);
      
      // Reset form
      setTodayCigarettes("");
      setTodayMood("");
      setSelectedTriggers([]);
      setSelectedSymptoms([]);
      setTodayNote("");
      
      toast.success("Đã ghi nhận tiến trình hôm nay thành công!");
      
      // Chuyển về tab tổng quan sau khi lưu thành công
      setActiveTab("overview");
    } catch (error) {
      console.error("Error saving progress:", error);
      toast.error("Có lỗi xảy ra khi lưu tiến trình!");
    }
  };

  // Handle plan operations
  const handleUpdatePlan = async (newPlan) => {
    setLoading(true);
    if (!plan) {
      toast.error("Không tìm thấy kế hoạch hiện tại!");
      return;
    }
    try {
      await api.put(`/GoalPlan/${plan.planId}`, newPlan);
      const res = await api.get("/GoalPlan/current-goal");
      setPlan(res.data);
      toast.success("Đã cập nhật kế hoạch!");
    } catch (err) {

      console.error("❌ Lỗi khi fetch MemberProfile:", err);

    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlan = async (newPlan) => {
    try {
      await api.post("/GoalPlan", newPlan);
      const res = await api.get("/GoalPlan/current-goal");
      setPlan(res.data);
      toast.success("Đã tạo kế hoạch mới!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Tạo kế hoạch thất bại!");
    }
  };

  // Loading states
  if (authLoading || loading) {
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

  if (!hasMembership) return null;

  // Tính phần trăm hoàn thành mục tiêu
  const percent = calculateGoalProgress(currentGoal, plan);

  // Render overview tab content
  const renderOverviewTab = () => (
    <div className="fade-in">
      {/* Header với thông tin người dùng */}
      <div className="dashboard-header text-white p-4 mb-4">
        <div className="content">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h3 className="mb-1">Chào mừng trở lại, {user?.fullName || 'Nguyễn Văn A'}</h3>
              <p className="mb-0 opacity-75">Bạn đã không hút thuốc được 23 ngày</p>
            </div>
            <div className="text-end">
              <h2 className="mb-0">{(progress.moneySaved || 345000).toLocaleString()}đ</h2>
              <small className="opacity-75">Tiền đã tiết kiệm</small>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <div className="card stats-card border-0 h-100">
            <div className="card-body text-center">
              <div className="icon-wrapper bg-success mx-auto mb-2">
                <i className="fas fa-calendar-check text-white"></i>
              </div>
              <div className="fw-bold">Kỷ lục tuần liệt</div>
              <h4 className="text-dark mb-0 fw-bold">{currentGoal?.smokeFreeDays || 23}</h4>
              <small className="text-muted">ngày</small>
              <div className="mt-2">
                <small className="text-success">Ngày không hút thuốc</small>
              </div>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card stats-card border-0 h-100">
            <div className="card-body text-center">
              <div className="icon-wrapper bg-primary mx-auto mb-2">
                <i className="fas fa-coins text-white"></i>
              </div>
              <div className="fw-bold">Tổng số tiền tiết kiệm</div>
              <h4 className="text-dark mb-0 fw-bold">{(progress.moneySaved || 345000).toLocaleString()}</h4>
              <small className="text-muted">đ</small>
              <div className="mt-2">    
                <small className="text-primary">Tiền tiết kiệm</small>
              </div>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card stats-card border-0 h-100">
            <div className="card-body text-center">
              <div className="icon-wrapper bg-danger mx-auto mb-2">
                <i className="fas fa-smoking-ban text-white"></i>
              </div>
              <div className="fw-bold">Cải thiện sức khỏe đầu</div>
              <h4 className="text-dark mb-0 fw-bold">{progress.health || 78}</h4>
              <small className="text-muted">/100</small>
              <div className="mt-2">
                <small className="text-danger">Điểm sức khỏe</small>
              </div>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card stats-card border-0 h-100">
            <div className="card-body text-center">
              <div className="icon-wrapper bg-warning mx-auto mb-2">
                <i className="fas fa-chart-line text-white"></i>
              </div>
              <div className="fw-bold">Kết tư nguy dàng lý</div>
              <h4 className="text-dark mb-0 fw-bold">{progress.riskReduction || 273}</h4>
              <small className="text-muted">ngày</small>
              <div className="mt-2">
                <small className="text-warning">Thời gian thành công</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hành động nhanh */}
      <div className="section-card">
        <div className="card-body">
          <h5 className="card-title mb-3">Hành động nhanh</h5>
          <div className="row g-3">
            <div className="col-6 col-md-2">
              <button 
                className="quick-action-btn btn w-100 d-flex flex-column align-items-center justify-content-center"
                onClick={() => setActiveTab("daily-log")}
              >
                <div className="icon-wrapper bg-success mb-2">
                  <i className="fas fa-check-circle text-white"></i>
                </div>
                <small className="text-dark">Ghi nhận hôm nay</small>
                <div className="mt-1">
                  <small className="text-muted">Cập nhật tiến trình</small>
                </div>
              </button>
            </div>
            <div className="col-6 col-md-2">
              <button 
                className="quick-action-btn btn w-100 d-flex flex-column align-items-center justify-content-center"
                onClick={() => setActiveTab("plan")}
              >
                <div className="icon-wrapper bg-primary mb-2">
                  <i className="fas fa-bullseye text-white"></i>
                </div>
                <small className="text-dark">Tạo kế hoạch</small>
                <div className="mt-1">
                  <small className="text-muted">Lập kế hoạch mới</small>
                </div>
              </button>
            </div>
            <div className="col-6 col-md-2">
              <button 
                className="quick-action-btn btn w-100 d-flex flex-column align-items-center justify-content-center"
                onClick={() => navigate('/coaches')}
              >
                <div className="icon-wrapper bg-info mb-2">
                  <i className="fas fa-user-md text-white"></i>
                </div>
                <small className="text-dark">Chat huấn luyện viên</small>
                <div className="mt-1">
                  <small className="text-muted">Tư vấn trực tiếp</small>
                </div>
              </button>
            </div>
            <div className="col-6 col-md-2">
              <button 
                className="quick-action-btn btn w-100 d-flex flex-column align-items-center justify-content-center"
                onClick={() => setActiveTab("appointment")}
              >
                <div className="icon-wrapper bg-warning mb-2">
                  <i className="fas fa-calendar-alt text-white"></i>
                </div>
                <small className="text-dark">Đặt lịch hẹn</small>
                <div className="mt-1">
                  <small className="text-muted">Hẹn với chuyên gia</small>
                </div>
              </button>
            </div>
            <div className="col-6 col-md-2">
              <button 
                className="quick-action-btn btn w-100 d-flex flex-column align-items-center justify-content-center"
                onClick={() => setActiveTab("notifications")}
              >
                <div className="icon-wrapper bg-secondary mb-2">
                  <i className="fas fa-history text-white"></i>
                </div>
                <small className="text-dark">Lịch sử thông báo</small>
                <div className="mt-1">
                  <small className="text-muted">Xem thông báo cũ</small>
                </div>
              </button>
            </div>
            <div className="col-6 col-md-2">
              <button 
                className="quick-action-btn btn w-100 d-flex flex-column align-items-center justify-content-center"
                onClick={() => setActiveTab("achievements")}
              >
                <div className="icon-wrapper bg-dark mb-2">
                  <i className="fas fa-trophy text-white"></i>
                </div>
                <small className="text-dark">Kết tư nguy dàng lý</small>
                <div className="mt-1">
                  <small className="text-muted">Xem thành tích</small>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Biểu đồ tiến trình 7 ngày */}
      <SevenDayProgressChart progressLogs={progressLogs} />
    </div>
  );

  // Render tab ghi nhận hôm nay
  const renderDailyLogTab = () => {
    const todayDate = new Date().toISOString().slice(0, 10);
    const alreadyLogged = progressLogs.find((log) => (log.logDate || log.date) === todayDate);
    
    return (
      <div className="fade-in">
        {/* Header */}
        <div className="dashboard-header text-white p-4 mb-4">
          <div className="content">
            <div className="text-center">
              <h3 className="mb-1">
                <i className="fas fa-calendar-check me-2"></i>
                Ghi nhận ngày {new Date().toLocaleDateString('vi-VN')}
              </h3>
              <p className="mb-0 opacity-75">
                {alreadyLogged 
                  ? "Bạn đã ghi nhận hôm nay. Cảm ơn bạn đã chia sẻ!" 
                  : "Hãy chia sẻ với chúng tôi ngày hôm nay của bạn"
                }
              </p>
            </div>
          </div>
        </div>

        {alreadyLogged ? (
          // Hiển thị thông tin đã ghi nhận
          <div className="section-card">
            <div className="card-body text-center">
              <i className="fas fa-check-circle text-success" style={{ fontSize: "4rem" }}></i>
              <h4 className="mt-3 text-success">Đã ghi nhận hôm nay!</h4>
              <p className="text-muted">Cảm ơn bạn đã chia sẻ tiến trình hôm nay</p>
              <div className="row mt-4">
                <div className="col-md-3">
                  <div className="text-center">
                    <h5 className="text-primary">{alreadyLogged.cigarettesSmoked}</h5>
                    <small className="text-muted">Điếu thuốc</small>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="text-center">
                    <h5 className="text-info">{alreadyLogged.mood}</h5>
                    <small className="text-muted">Tâm trạng</small>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="text-center">
                    <h5 className="text-warning">{alreadyLogged.triggers?.length || 0}</h5>
                    <small className="text-muted">Yếu tố kích hoạt</small>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="text-center">
                    <h5 className="text-danger">{alreadyLogged.symptoms?.length || 0}</h5>
                    <small className="text-muted">Triệu chứng</small>
                  </div>
                </div>
              </div>
              <button 
                className="btn btn-outline-primary mt-3"
                onClick={() => setActiveTab("overview")}
              >
                <i className="fas fa-arrow-left me-2"></i>Quay về tổng quan
              </button>
            </div>
          </div>
        ) : (
          // Form ghi nhận
          <form onSubmit={handleSubmitDailyProgress}>
            {/* Số điếu thuốc */}
            <div className="daily-progress-card mb-4">
              <div className="card-header text-white">
                <h5 className="mb-0">
                  <i className="fas fa-smoking me-2"></i>
                  Số điếu thuốc đã hút hôm nay
                </h5>
              </div>
              <div className="card-body">
                <div className="progress-input-group input-group">
                  <button 
                    type="button" 
                    className="btn btn-outline-danger"
                    onClick={() => setTodayCigarettes(Math.max(0, parseInt(todayCigarettes || 0) - 1).toString())}
                  >
                    <i className="fas fa-minus"></i>
                  </button>
                  <input
                    type="number"
                    className="form-control text-center"
                    value={todayCigarettes}
                    onChange={(e) => setTodayCigarettes(e.target.value)}
                    min="0"
                    placeholder="0"
                  />
                  <span className="input-group-text">điếu thuốc</span>
                  <button 
                    type="button" 
                    className="btn btn-outline-success"
                    onClick={() => setTodayCigarettes((parseInt(todayCigarettes || 0) + 1).toString())}
                  >
                    <i className="fas fa-plus"></i>
                  </button>
                </div>
                {todayCigarettes === "0" && (
                  <div className="alert alert-success mt-3 mb-0">
                    <i className="fas fa-trophy me-2"></i>
                    Tuyệt vời! Bạn đã không hút thuốc hôm nay
                  </div>
                )}
              </div>
            </div>

            {/* Tâm trạng hôm nay */}
            <div className="section-card mb-4">
              <div className="card-body">
                <h5 className="card-title">
                  <i className="fas fa-heart me-2"></i>Tâm trạng hôm nay *
                </h5>
                <div className="row g-2">
                  {moodOptions.map((mood) => (
                    <div key={mood.id} className="col-4 col-md-2">
                      <button
                        type="button"
                        className={`mood-btn btn w-100 d-flex flex-column align-items-center ${
                          todayMood === mood.id ? 'btn-primary active' : 'btn-outline-secondary'
                        }`}
                        onClick={() => setTodayMood(mood.id)}
                        style={todayMood === mood.id ? { backgroundColor: mood.color, borderColor: mood.color } : {}}
                      >
                        <span className="fs-2 mb-1">{mood.emoji}</span>
                        <small>{mood.label}</small>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Yếu tố kích hoạt thêm thuốc */}
            <div className="section-card mb-4">
              <div className="card-body">
                <h5 className="card-title">
                  <i className="fas fa-exclamation-triangle me-2"></i>Yếu tố kích hoạt thêm thuốc
                </h5>
                <p className="text-muted small mb-3">Chọn những yếu tố đã khiến bạn muốn hút thuốc hôm nay</p>
                <div className="row g-2">
                  {triggerOptions.map((trigger, index) => (
                    <div key={index} className="col-6 col-md-4">
                      <button
                        type="button"
                        className={`trigger-btn btn w-100 text-start ${
                          selectedTriggers.includes(trigger) ? 'btn-warning' : 'btn-outline-warning'
                        }`}
                        onClick={() => {
                          if (selectedTriggers.includes(trigger)) {
                            setSelectedTriggers(selectedTriggers.filter(t => t !== trigger));
                          } else {
                            setSelectedTriggers([...selectedTriggers, trigger]);
                          }
                        }}
                      >
                        <small>{trigger}</small>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Triệu chứng cai thuốc */}
            <div className="section-card mb-4">
              <div className="card-body">
                <h5 className="card-title">
                  <i className="fas fa-heartbeat me-2"></i>Triệu chứng cai thuốc
                </h5>
                <p className="text-muted small mb-3">Những triệu chứng bạn đã trải qua hôm nay</p>
                <div className="row g-2">
                  {symptomOptions.map((symptom, index) => (
                    <div key={index} className="col-6 col-md-4">
                      <button
                        type="button"
                        className={`symptom-btn btn w-100 text-start ${
                          selectedSymptoms.includes(symptom) ? 'btn-info' : 'btn-outline-info'
                        }`}
                        onClick={() => {
                          if (selectedSymptoms.includes(symptom)) {
                            setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
                          } else {
                            setSelectedSymptoms([...selectedSymptoms, symptom]);
                          }
                        }}
                      >
                        <small>{symptom}</small>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Ghi chú thêm */}
            <div className="section-card mb-4">
              <div className="card-body">
                <h5 className="card-title">
                  <i className="fas fa-edit me-2"></i>Ghi chú thêm
                </h5>
                <textarea 
                  className="form-control" 
                  rows="3" 
                  placeholder="Chia sẻ cảm nghĩ, thách thức hoặc thành tựu của bạn hôm nay..."
                  value={todayNote}
                  onChange={(e) => setTodayNote(e.target.value)}
                  maxLength="500"
                />
                <div className="text-end mt-2">
                  <small className="text-muted">{todayNote.length}/500 kí tự</small>
                </div>
              </div>
            </div>

            {/* Submit button */}
            <div className="text-center">
              <button type="submit" className="btn btn-success btn-lg px-5">
                <i className="fas fa-save me-2"></i>Lưu ghi nhận hôm nay
              </button>
            </div>
          </form>
        )}
      </div>
    );
  };

  // Render tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case TABS.OVERVIEW:
        return renderOverviewTab();
      
      case "daily-log":
        return renderDailyLogTab();
      
      case "progress":
        return (
          <ProgressTab
            progressLogs={progressLogs}
            currentGoal={currentGoal}
            plan={plan}
          />
        );
      
      case TABS.PLAN:
        return (
          <PlanTabNew />
        );
      
      case "planhistory":
        return (
          <div>
            <h3>Lịch sử kế hoạch</h3>
            {planHistory.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Ngày bắt đầu</th>
                      <th>Ngày kết thúc</th>
                      <th>Mục tiêu</th>
                      <th>Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {planHistory.map((historyPlan, idx) => (
                      <tr key={idx}>
                        <td>{new Date(historyPlan.startDate).toLocaleDateString()}</td>
                        <td>{new Date(historyPlan.targetQuitDate).toLocaleDateString()}</td>
                        <td>{historyPlan.goalDescription}</td>
                        <td>
                          <span className={`badge ${
                            historyPlan.isCompleted ? "bg-success" : "bg-warning"
                          }`}>
                            {historyPlan.isCompleted ? "Hoàn thành" : "Đang thực hiện"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-5">
                <i className="fas fa-history text-muted" style={{ fontSize: "4rem" }} />
                <h4 className="mt-3 text-muted">Chưa có lịch sử kế hoạch</h4>
              </div>
            )}
          </div>
        );
      
      case TABS.JOURNAL:
        return (
          <JournalManager
            journal={journal}
            setJournal={setJournal}
            progressLogs={progressLogs}
          />
        );
      
      case "achievements":
        return (
          <BadgeComponents
            progress={progress}
            achievedBadges={achievedBadges}
            setAchievedBadges={setAchievedBadges}
          />
        );
      
      case "report":
        return (
          <div>
            <h3>Báo cáo nâng cao</h3>
            <div className="row">
              <div className="col-md-6">
                <div className="card">
                  <div className="card-body">
                    <h5>Thống kê tổng quát</h5>
                    <p>Tổng số lần cai: {quitHistory.length + 1}</p>
                    <p>Kỷ lục: {Math.max(...[...quitHistory.map(h => h.daysNoSmoke), progress.daysNoSmoke], 0)} ngày</p>
                    <p>Tổng tiền tiết kiệm: {(quitHistory.reduce((sum, h) => sum + (h.moneySaved || 0), 0) + progress.moneySaved).toLocaleString()}đ</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <div className="card">
                  <div className="card-body">
                    <h5>So sánh với cộng đồng</h5>
                    <div className="mb-2">
                      <small>Ngày không hút</small>
                      <div className="progress">
                        <div 
                          className="progress-bar" 
                          style={{width: `${Math.min((progress.daysNoSmoke / COMMUNITY_AVG.daysNoSmoke) * 100, 100)}%`}}
                        />
                      </div>
                      <small>{progress.daysNoSmoke}/{COMMUNITY_AVG.daysNoSmoke}</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      
      case TABS.SYSTEM_REPORT:
        return <SystemReportForm />;
      
      case "profile":
        return (
          <ProfileManager
            memberProfile={memberProfile}
            setMemberProfile={setMemberProfile}
            smokingStatus={smokingStatus}
            setSmokingStatus={setSmokingStatus}
            quitAttempts={quitAttempts}
            setQuitAttempts={setQuitAttempts}
            experienceLevel={experienceLevel}
            setExperienceLevel={setExperienceLevel}
            previousAttempts={previousAttempts}
            setPreviousAttempts={setPreviousAttempts}
            fetchProfile={fetchProfile}
          />
        );
      
      case TABS.APPOINTMENT:
        return (
          <AppointmentManager
            appointments={appointments}
            coachList={coachList}
            fetchAppointments={fetchAppointments}
          />
        );
      
      case TABS.NOTIFICATIONS:
        return (
          <NotificationManager
            progress={progress}
            plan={plan}
          />
        );
      
      default:
        return renderOverviewTab();
    }
  };

  return (
    <div className="bg-white py-5">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="text-primary text-uppercase fw-semibold fs-6">
            Dashboard cá nhân
          </h2>
          <p className="mt-2 display-6 fw-bold text-dark">
            Theo dõi tiến trình cai thuốc của bạn
          </p>
        </div>
        
        <div className="bg-white shadow rounded-4 overflow-hidden">
          {/* Navigation Tabs */}
          <ul className="nav nav-tabs px-3 pt-3">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "overview" ? "active" : ""}`}
                onClick={() => setActiveTab("overview")}
              >
                <i className="fas fa-chart-pie me-2"></i>Tổng quan
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "daily-log" ? "active" : ""}`}
                onClick={() => setActiveTab("daily-log")}
              >
                <i className="fas fa-calendar-check me-2"></i>Ghi nhận hôm nay
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "progress" ? "active" : ""}`}
                onClick={() => setActiveTab("progress")}
              >
                <i className="fas fa-chart-line me-2"></i>Tiến trình
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "plan" ? "active" : ""}`}
                onClick={() => setActiveTab("plan")}
              >
                <i className="fas fa-calendar-alt me-2"></i>Kế hoạch
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === "planhistory" ? "active" : ""}`} 
                onClick={() => setActiveTab("planhistory")}
              >
                <i className="fas fa-history me-2"></i>Lịch sử kế hoạch
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "journal" ? "active" : ""}`}
                onClick={() => setActiveTab("journal")}
              >
                <i className="fas fa-book me-2"></i>Nhật ký
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "achievements" ? "active" : ""}`}
                onClick={() => setActiveTab("achievements")}
              >
                <i className="fas fa-award me-2"></i>Thành tích
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "report" ? "active" : ""}`}
                onClick={() => setActiveTab("report")}
              >
                <i className="fas fa-chart-bar me-2"></i>Báo cáo nâng cao
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "systemreport" ? "active" : ""}`}
                onClick={() => setActiveTab("systemreport")}
              >
                <i className="fas fa-flag me-2"></i>Báo cáo hệ thống
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "profile" ? "active" : ""}`}
                onClick={() => setActiveTab("profile")}
              >
                <i className="fas fa-user me-2"></i>Hồ sơ cá nhân
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "appointment" ? "active" : ""}`}
                onClick={() => setActiveTab("appointment")}
              >
                <i className="fas fa-calendar-alt me-2"></i>Lên lịch hẹn
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "notifications" ? "active" : ""}`}
                onClick={() => setActiveTab("notifications")}
              >
                <i className="fas fa-bell me-2"></i>Thông báo
              </button>
            </li>
          </ul>
          
          {/* Tab Content */}
          <div className="p-4">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
