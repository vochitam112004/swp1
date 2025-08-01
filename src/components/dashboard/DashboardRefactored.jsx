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

// Import separated components
import BadgeComponents from "./components/BadgeComponents";
import ProgressTracker from "./components/ProgressTracker";
import JournalManager from "./components/JournalManager";
import ProfileManager from "./components/ProfileManager";
import AppointmentManager from "./components/AppointmentManager";
import NotificationManager from "./components/NotificationManager";
import SystemReportForm from "../common/SystemReportForm";
import NotificationHistory from "./NotificationHistory";
import PlanTab from "./plantab";

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

  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

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
      toast.error(err.response?.data?.message || "Cập nhật kế hoạch thất bại!");
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
    <div>
      {/* Progress Circle */}
      <div className="row mb-4">
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
                    strokeDasharray={2 * Math.PI * 40}
                    strokeDashoffset={2 * Math.PI * 40 * (1 - percent / 100)}
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
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="col-md-8">
          <div className="row g-4">
            <div className="col-md-4">
              <div className="bg-primary bg-opacity-10 p-3 rounded-3 shadow-sm d-flex align-items-center">
                <div className="bg-primary bg-opacity-25 rounded-circle p-3 text-primary">
                  <i className="fas fa-calendar-check"></i>
                </div>
                <div className="ms-3">
                  <div className="small text-secondary">Số ngày không hút</div>
                  <div className="h4 fw-bold text-primary mb-0">
                    {currentGoal?.smokeFreeDays || progress.daysNoSmoke} ngày
                  </div>
                  <small className="text-muted">
                    Trung bình: {COMMUNITY_AVG.daysNoSmoke} ngày
                  </small>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="bg-success bg-opacity-10 p-3 rounded-3 shadow-sm d-flex align-items-center">
                <div className="bg-success bg-opacity-25 rounded-circle p-3 text-success">
                  <i className="fas fa-wallet"></i>
                </div>
                <div className="ms-3">
                  <div className="small text-secondary">Tiền tiết kiệm</div>
                  <div className="h4 fw-bold text-success mb-0">
                    {(progress.moneySaved || 0).toLocaleString()}đ
                  </div>
                  <small className="text-muted">
                    Trung bình: {COMMUNITY_AVG.moneySaved.toLocaleString()}đ
                  </small>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="bg-info bg-opacity-10 p-3 rounded-3 shadow-sm d-flex align-items-center">
                <div className="bg-info bg-opacity-25 rounded-circle p-3 text-info">
                  <i className="fas fa-heartbeat"></i>
                </div>
                <div className="ms-3">
                  <div className="small text-secondary">Cải thiện sức khỏe</div>
                  <div className="h4 fw-bold text-info mb-0">{progress.health || 0}%</div>
                  <small className="text-muted">
                    Trung bình: {COMMUNITY_AVG.health}%
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Tracker */}
      <ProgressTracker
        progress={progress}
        currentGoal={currentGoal}
        plan={plan}
        progressLogs={progressLogs}
        setProgressLogs={setProgressLogs}
        setCurrentGoal={setCurrentGoal}
        pricePerPack={pricePerPack}
        setPricePerPack={setPricePerPack}
        cigarettesPerPack={cigarettesPerPack}
        setCigarettesPerPack={setCigarettesPerPack}
      />
    </div>
  );

  // Render tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case TABS.OVERVIEW:
        return renderOverviewTab();
      
      case TABS.PLAN:
        return (
          <PlanTab
            plan={plan}
            onUpdatePlan={handleUpdatePlan}
            onCreatePlan={handleCreatePlan}
          />
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
