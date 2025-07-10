// Có thể là giao diện chính người dùng.
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Line } from "react-chartjs-2";
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
import { saveAs } from "file-saver";
import api from "../../api/axios";
import SystemReportForm from "../common/SystemReportForm";
import NotificationHistory from "./NotificationHistory";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Đặt BADGES và getAchievedBadges ra ngoài function Dashboard
const BADGES = [
  { key: "1day", label: "1 ngày không hút", icon: "fas fa-calendar-check", condition: (p) => p.daysNoSmoke >= 1 },
  { key: "7days", label: "1 tuần không hút", icon: "fas fa-trophy", condition: (p) => p.daysNoSmoke >= 7 },
  { key: "30days", label: "30 ngày không hút", icon: "fas fa-award", condition: (p) => p.daysNoSmoke >= 30 },
  { key: "100k", label: "Tiết kiệm 100K", icon: "fas fa-piggy-bank", condition: (p) => p.moneySaved >= 100000 },
  { key: "500k", label: "Tiết kiệm 500K", icon: "fas fa-wallet", condition: (p) => p.moneySaved >= 500000 },
  // Thêm các badge khác nếu muốn
];

function getAchievedBadges(progress) {
  return BADGES.filter(b => b.condition(progress));
}

function shouldSendReminder(lastSent, frequency) {
  const now = new Date();
  if (!lastSent) return true;
  const last = new Date(lastSent);
  if (frequency === "daily") {
    return now.toDateString() !== last.toDateString();
  }
  if (frequency === "weekly") {
    const getWeek = d => {
      d = new Date(d);
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - d.getDay() + 1);
      return d;
    };
    return getWeek(now).getTime() !== getWeek(last).getTime();
  }
  if (frequency === "monthly") {
    return now.getMonth() !== last.getMonth() || now.getFullYear() !== last.getFullYear();
  }
  return false;
}

function requestNotificationPermission() {
  if ("Notification" in window && Notification.permission === "default") {
    Notification.requestPermission();
  }
}
function sendBrowserNotification(title, body, type = "motivation") {
  const settings = JSON.parse(localStorage.getItem("notificationSettings") || "{}");
  if (settings.enableBrowserNotifications === false) return;
  if (type === "motivation" && settings.enableMotivationMessages === false) return;
  if (type === "health" && settings.enableHealthTips === false) return;
  if (type === "milestone" && settings.enableMilestoneNotifications === false) return;
  if (type === "achievement" && settings.enableAchievementNotifications === false) return;

  if ("Notification" in window) {
    if (Notification.permission === "granted") {
      new Notification(title, { body });
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          new Notification(title, { body });
        } else {
          toast.info(`${title}: ${body}`);
        }
      });
    } else {
      toast.info(`${title}: ${body}`);
    }
  } else {
    toast.info(`${title}: ${body}`);
  }
  // Lưu lịch sử thông báo
  const history = JSON.parse(localStorage.getItem("notificationHistory") || "[]");
  history.push({
    title,
    message: body,
    type,
    timestamp: Date.now(),
  });
  localStorage.setItem("notificationHistory", JSON.stringify(history.slice(-100)));
}

const Dashboard = () => {
  const safeParse = (key, fallback) => {
    try {
      const val = localStorage.getItem(key);
      return val ? JSON.parse(val) : fallback;
    } catch {
      return fallback;
    }
  };


  // Thêm state cho lịch sử tiến trình và số lần tái nghiện
  const [quitHistory, setQuitHistory] = useState(() => safeParse("quitHistory", []));
  const [todayCigarettes, setTodayCigarettes] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [journal, setJournal] = useState(() => safeParse("quitJournal", []));
  const [journalEntry, setJournalEntry] = useState("");
  const [journalDate, setJournalDate] = useState(() => {
    // Mặc định là hôm nay
    return new Date().toISOString().slice(0, 10);
  });
  const [pricePerPack, setPricePerPack] = useState(() => localStorage.getItem("pricePerPack") || "");
  const [comments, setComments] = useState(() => safeParse("badgeComments", {}));
  const [editIdx, setEditIdx] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [progressLogs, setProgressLogs] = useState([]);
  const [progress, setProgress] = useState({ daysNoSmoke: 0, moneySaved: 0, health: 0 });
  const [plan, setPlan] = useState(null);
  // Thêm state cho mục tiêu hiện tại từ API
  const [currentGoal, setCurrentGoal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [memberGoals, setMemberGoals] = useState([]);
  const [cigarettesPerPack, setCigarettesPerPack] = useState(20);

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      try {
        const [
          progressLogRes,
          currentGoalRes,
          goalPlanRes,
          memberGoalRes
        ] = await Promise.all([
          api.get("/ProgressLog/GetProgress-logs"),
          api.get("/CurrentGoal"),
          api.get("/GoalPlan/all-goals"),
          api.get("/MemberGoal")
        ]);
        setProgressLogs(progressLogRes.data);
        setCurrentGoal(currentGoalRes.data);
        setPlan(goalPlanRes.data[0] || null);
        setMemberGoals(memberGoalRes.data);
      } catch (err) {
        toast.error("Lỗi tải dữ liệu!");
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []); // <-- chỉ chạy khi mount

  // Hàm ghi nhận tiến trình mỗi ngày
  const handleSubmitProgress = async (e) => {
    e.preventDefault();
    const today = new Date().toISOString().slice(0, 10);
    const existed = journal.find(j => j.date === today);
    if (existed) {
      toast.error("Bạn đã ghi nhật ký cho ngày hôm nay. Hãy sửa hoặc xóa để ghi lại.");
      return;
    }

    if (isNaN(todayCigarettes) || todayCigarettes === "" || todayCigarettes < 0) {
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

    const logDate = new Date().toISOString().slice(0, 10);
    const body = {
      logDate,
      cigarettesSmoked: Number(todayCigarettes),
      pricePerPack: Number(pricePerPack),
      cigarettesPerPack: Number(cigarettesPerPack), // BẮT BUỘC
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

      // Thêm dòng này để reload lại currentGoal
      const goalRes = await api.get("/CurrentGoal");
      setCurrentGoal(goalRes.data);

      // Tính lại progress
      let daysNoSmoke = 0;
      let moneySaved = 0;
      let health = 0;
      res.data.forEach(log => {
        if (log.cigarettesSmoked === 0) daysNoSmoke += 1;
        moneySaved += log.pricePerPack || 0;
      });
      health = Math.min(daysNoSmoke, 100);
      setProgress({ daysNoSmoke, moneySaved, health });
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi kết nối API!");
    }
  };

  // Lấy nhật ký từ API khi load
  useEffect(() => {
    async function fetchJournal() {
      try {
        const res = await api.get("/ProgressLog/GetProgress-logs");
        setJournal(res.data);
      } catch {
        setJournal([]);
      }
    }
    fetchJournal();
  }, []);

  // Lưu nhật ký qua API thay vì localStorage
  const handleJournalSubmit = async (e) => {
    e.preventDefault();
    if (!journalEntry.trim()) return;
    try {
      await api.post("/ProgressLog/CreateProgress-log", {
        date: journalDate,
        content: journalEntry,
      });
      toast.success("Đã lưu nhật ký!");
      // Sau khi lưu thành công, reload lại nhật ký
      const res = await api.get("/ProgressLog/GetProgress-log");
      setJournal(res.data);
      setJournalEntry("");
    } catch {
      toast.error("Lưu nhật ký thất bại!");
    }
  };

  // Dữ liệu cho biểu đồ tiến trình (số ngày không hút liên tục)
  const chartLabels = journal.map(j => j.date);
  const chartData = journal.map((j, idx) => idx + 1);

  // Thông báo mỗi ngày 1 lần
  useEffect(() => {
    requestNotificationPermission();
    const lastNotify = localStorage.getItem("lastMotivationNotify");
    const today = new Date().toISOString().slice(0, 10);
    if (lastNotify !== today) {
      toast.info("Hãy nhớ lý do bạn bắt đầu! Mỗi ngày không thuốc lá là một chiến thắng mới 💪");
      sendBrowserNotification("Động viên cai thuốc", "Hãy nhớ lý do bạn bắt đầu! Mỗi ngày không thuốc lá là một chiến thắng mới 💪"); // Thêm dòng này
      localStorage.setItem("lastMotivationNotify", today);
    }
  }, []);
  // Thông báo khi đạt badge mới
  useEffect(() => {
    const achieved = getAchievedBadges(progress);
    const shown = JSON.parse(localStorage.getItem("shownBadges") || "[]");
    achieved.forEach(badge => {
      if (!shown.includes(badge.key)) {
        toast.success(`Chúc mừng! Bạn vừa đạt huy hiệu: ${badge.label}`);
        sendBrowserNotification("Chúc mừng!", `Bạn vừa đạt huy hiệu: ${badge.label}`); // Thêm dòng này
        shown.push(badge.key);
      }
    });
    localStorage.setItem("shownBadges", JSON.stringify(shown));
  }, [progress]);

  // Thông báo động viên cá nhân
  useEffect(() => {
    // Lấy kế hoạch từ localStorage
    const plan = JSON.parse(localStorage.getItem("quitPlan") || "{}");
    const reason = plan.reason || "Hãy nhớ lý do bạn bắt đầu!";
    const frequency = plan.reminderFrequency || "daily";
    const lastNotify = localStorage.getItem("lastPersonalReasonNotify");
    if (shouldSendReminder(lastNotify, frequency)) {
      toast.info(`Động viên: ${reason}`);
      sendBrowserNotification("Động viên cai thuốc", reason);
      localStorage.setItem("lastPersonalReasonNotify", new Date().toISOString());
    }
  }, []);

  // Chia sẻ huy hiệu
  function shareBadge(badge) {
    const shared = JSON.parse(localStorage.getItem("sharedBadges") || "[]");
    shared.push({
      badge: badge.label,
      user: progress.displayName || "Bạn",
      time: new Date().toLocaleString(),
    });
    localStorage.setItem("sharedBadges", JSON.stringify(shared));
    toast.info(`Bạn đã chia sẻ huy hiệu "${badge.label}" lên cộng đồng!`);
  }

  // Thêm các state và hàm xử lý động viên, bình luận
  const [forceUpdate, setForceUpdate] = useState(0);
  const [commentInputs, setCommentInputs] = useState({});

  function handleEncourage(idx) {
    const encouragesObj = JSON.parse(localStorage.getItem("encourages") || "{}");
    encouragesObj[idx] = (encouragesObj[idx] || 0) + 1;
    localStorage.setItem("encourages", JSON.stringify(encouragesObj));
    setEncourages(encouragesObj); // cập nhật state encourages
    toast.success("Bạn đã động viên thành công!");
    setForceUpdate(f => f + 1);
  }

  function handleAddComment(idx, comment) {
    const commentsObj = JSON.parse(localStorage.getItem("badgeComments") || "{}");
    if (!commentsObj[idx]) commentsObj[idx] = [];
    commentsObj[idx].push({ text: comment, time: new Date().toLocaleString() });
    localStorage.setItem("badgeComments", JSON.stringify(commentsObj));
    setComments(commentsObj); // cập nhật state comments
    setForceUpdate(f => f + 1);
  }

  const communityAvg = {
    daysNoSmoke: 18,
    moneySaved: 1260000,
    health: 36,
  };

  function exportCSV() {
    if (journal.length === 0) {
      toast.info("Chưa có nhật ký để xuất!");
      return;
    }
    const rows = [
      ["Ngày", "Nội dung nhật ký"],
      ...journal.map(j => [j.date, j.content.replace(/\n/g, " ")]),
    ];
    const csv = rows.map(r => r.map(x => `"${x}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "nhat-ky-cai-thuoc.csv");
  }

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "quitProgress") {
        setProgress(JSON.parse(e.newValue || '{"startDate":null,"daysNoSmoke":0,"moneySaved":0,"health":0}'));
      }
      if (e.key === "encourages") {
        setEncourages(JSON.parse(e.newValue || "{}"));
      }
      if (e.key === "badgeComments") {
        setComments(JSON.parse(e.newValue || "{}"));
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Lấy goalDays từ kế hoạch (quitPlan) hoặc mặc định 60
  // const plan = JSON.parse(localStorage.getItem("quitPlan") || "{}");
  // const goalDays = plan.goalDays || 60;
  // const frequency = plan.reminderFrequency || "daily"; // Thêm dòng này

  // Tính phần trăm hoàn thành mục tiêu (ưu tiên currentGoal nếu có)
  const percent = currentGoal && currentGoal.totalDays
    ? Math.min(Math.round((currentGoal.smokeFreeDays / currentGoal.totalDays) * 100), 100)
    : Math.min(Math.round((progress.daysNoSmoke / (plan?.goalDays || 60)) * 100), 100);

  // Tính strokeDashoffset cho vòng tròn SVG
  const circleLength = 2 * Math.PI * 40; // r=40
  const offset = circleLength * (1 - percent / 100);

  // Tính toán thống kê nâng cao
  const allStreaks = [...quitHistory.map(h => h.daysNoSmoke), progress.daysNoSmoke];
  const maxStreak = Math.max(...allStreaks, 0);
  const relapseCount = quitHistory.length;
  const totalMoneySaved = quitHistory.reduce((sum, h) => sum + (h.moneySaved || 0), 0) + progress.moneySaved;

  // Thêm danh sách bài viết mẫu
  const TIPS = [
    { minDay: 0, maxDay: 3, title: "Vượt qua 3 ngày đầu", content: "3 ngày đầu là khó khăn nhất. Hãy uống nhiều nước và tránh môi trường có khói thuốc." },
    { minDay: 4, maxDay: 7, title: "Giữ vững quyết tâm", content: "Bạn đã vượt qua giai đoạn khó nhất. Hãy chia sẻ với bạn bè để được động viên." },
    { minDay: 8, maxDay: 30, title: "Tạo thói quen mới", content: "Hãy thử tập thể dục hoặc học kỹ năng mới để quên đi cảm giác thèm thuốc." },
    { minDay: 31, maxDay: 1000, title: "Duy trì thành quả", content: "Tiếp tục duy trì lối sống lành mạnh và tự thưởng cho bản thân." },
  ];

  function getPersonalizedTips(daysNoSmoke) {
    return TIPS.filter(tip => daysNoSmoke >= tip.minDay && daysNoSmoke <= tip.maxDay);
  }

  useEffect(() => {
    async function fetchProgressLogs() {
      try {
        const res = await api.get("/ProgressLog/GetProgress-log");
        setProgressLogs(res.data);
      } catch {
        setProgressLogs([]);
      }
    }
    fetchProgressLogs();
  }, []);

  const handleAddProgressLog = async (logData) => {
    try {
      await api.post("/ProgressLog/CreateProgress-log", logData);
      const [logsRes, goalRes] = await Promise.all([
        api.get("/ProgressLog/GetProgress-log"),
        api.get("/CurrentGoal"),
      ]);
      setProgressLogs(logsRes.data);
      setCurrentGoal(goalRes.data);
      toast.success("Đã ghi nhận tiến trình!");
    } catch {
      toast.error("Ghi nhật ký thất bại!");
    }
  };

  const handleDeleteProgressLog = async (logId) => {
    try {
      await api.delete(`/ProgressLog/DeleteByIdProgress-log/${logId}`);
      const res = await api.get("/ProgressLog/GetProgress-log");
      setProgressLogs(res.data);
      toast.success("Đã xóa nhật ký!");
    } catch {
      toast.error("Xóa nhật ký thất bại!");
    }
  };

  // Lấy kế hoạch từ API khi load
  useEffect(() => {
    api.get("/GoalPlan/all-goals")
      .then(res => setPlan(res.data[0] || null))
      .catch(() => setPlan(null));
  }, []);

  // Lấy mục tiêu hiện tại từ API khi load
  useEffect(() => {
    api.get("/CurrentGoal")
      .then(res => {
        console.log("CurrentGoal API result:", res.data);
        setCurrentGoal(res.data);
      })
      .catch(() => setCurrentGoal(null));
  }, []);

  // Lấy danh sách MemberGoal khi load
  useEffect(() => {
    api.get("/MemberGoal")
      .then(res => setMemberGoals(res.data))
      .catch(() => setMemberGoals([]));
  }, []);

  // Hàm cập nhật GoalPlan qua API
  const handleUpdatePlan = async (newPlan) => {
    if (!plan) {
      toast.error("Không tìm thấy kế hoạch để cập nhật.");
      return;
    }
    try {
      await api.put("/GoalPlan/Update-GoalPlan", {
        ...newPlan,
        goalPlanId: plan.goalPlanId,
      });
      const res = await api.get("/GoalPlan/current-goal");
      setPlan(res.data[0] || null);
      toast.success("Đã cập nhật kế hoạch!");
    } catch {
      toast.error("Cập nhật kế hoạch thất bại!");
    }
  };

  // Hàm tạo mới GoalPlan qua API
  const handleCreatePlan = async (newPlan) => {
    if (plan) {
      toast.error("Bạn đã có kế hoạch. Hãy xóa kế hoạch cũ trước khi tạo mới.");
      return;
    }
    try {
      await api.post("/GoalPlan", newPlan);
      const res = await api.get("/GoalPlan/current-goal");
      setPlan(res.data[0] || null);
      toast.success("Đã tạo kế hoạch mới!");
    } catch {
      toast.error("Tạo kế hoạch mới thất bại!");
    }
  };

  if (loading) return <div style={{ textAlign: "center", marginTop: 40 }}><span className="spinner-border"></span> Đang tải dữ liệu...</div>;

  return (
    <div className="bg-white py-5">
      <div className="container">
        <div className="text-center mb-5">
          <h2 className="text-primary text-uppercase fw-semibold fs-6">Dashboard cá nhân</h2>
          <p className="mt-2 display-6 fw-bold text-dark">
            Theo dõi tiến trình cai thuốc của bạn
          </p>
        </div>
        <div className="bg-white shadow rounded-4 overflow-hidden">
          {/* Tabs */}
          <ul className="nav nav-tabs px-3 pt-3">
            <li className="nav-item">
              <button className={`nav-link ${activeTab === "overview" ? "active" : ""}`} onClick={() => setActiveTab("overview")}>
                <i className="fas fa-chart-pie me-2"></i>Tổng quan
              </button>
            </li>
            <li className="nav-item">
              <button className={`nav-link ${activeTab === "plan" ? "active" : ""}`} onClick={() => setActiveTab("plan")}>
                <i className="fas fa-calendar-alt me-2"></i>Kế hoạch
              </button>
            </li>
            <li className="nav-item">
              <button className={`nav-link ${activeTab === "journal" ? "active" : ""}`} onClick={() => setActiveTab("journal")}>
                <i className="fas fa-history me-2"></i>Nhật ký
              </button>
            </li>
            <li className="nav-item">
              <button className={`nav-link ${activeTab === "achievements" ? "active" : ""}`} onClick={() => setActiveTab("achievements")}>
                <i className="fas fa-award me-2"></i>Thành tích
              </button>
            </li>
            <li className="nav-item">
              <button className={`nav-link ${activeTab === "report" ? "active" : ""}`} onClick={() => setActiveTab("report")}>
                <i className="fas fa-chart-bar me-2"></i>Báo cáo nâng cao
              </button>
            </li>
            <li className="nav-item">
              <button className={`nav-link ${activeTab === "systemreport" ? "active" : ""}`} onClick={() => setActiveTab("systemreport")}>
                <i className="fas fa-flag me-2"></i>Báo cáo hệ thống
              </button>
            </li>
          </ul>
          <div className="p-4">
            {activeTab === "overview" && (
              <div>

                {/* Stats */}
                <div className="row g-4 mb-4">
                  <div className="col-md-3">
                    <div className="bg-primary bg-opacity-10 p-3 rounded-3 shadow-sm d-flex align-items-center">
                      <div className="bg-primary bg-opacity-25 rounded-circle p-3 text-primary">
                        <i className="fas fa-calendar-check"></i>
                      </div>
                      <div className="ms-3">
                        <div className="small text-secondary">Số ngày không hút</div>
                        <div className="h4 fw-bold text-primary mb-0">
                          {progress.daysNoSmoke} ngày
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="bg-success bg-opacity-10 p-3 rounded-3 shadow-sm d-flex align-items-center">
                      <div className="bg-success bg-opacity-25 rounded-circle p-3 text-success">
                        <i className="fas fa-wallet"></i>
                      </div>
                      <div className="ms-3">
                        <div className="small text-secondary">Tiền tiết kiệm</div>
                        <div className="h4 fw-bold text-success mb-0">
                          {progress.moneySaved.toLocaleString()}đ
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="bg-info bg-opacity-10 p-3 rounded-3 shadow-sm d-flex align-items-center">
                      <div className="bg-info bg-opacity-25 rounded-circle p-3 text-info">
                        <i className="fas fa-heartbeat"></i>
                      </div>
                      <div className="ms-3">
                        <div className="small text-secondary">Cải thiện sức khỏe</div>
                        <div className="h4 fw-bold text-info mb-0">
                          {progress.health}%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress & Goal */}
                <div className="row g-4">
                  <div className="col-md-8">
                    <div className="bg-white p-4 rounded-3 shadow-sm border mb-4 mb-md-0">
                      <h3 className="fs-5 fw-semibold mb-3">Tiến trình cai thuốc</h3>
                      <div className="d-flex align-items-center justify-content-center" style={{ height: "250px", background: "#f5f6fa", borderRadius: "1rem" }}>
                        <span className="text-secondary">Biểu đồ tiến trình sẽ hiển thị tại đây</span>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="bg-white p-4 rounded-3 shadow-sm border text-center">
                      <h3 className="fs-5 fw-semibold mb-3">Mục tiêu hiện tại</h3>
                      <div className="position-relative mx-auto mb-3" style={{ width: "160px", height: "160px" }}>
                        <svg width="160" height="160" viewBox="0 0 100 100">
                          <circle stroke="#e9ecef" strokeWidth="10" fill="transparent" r="40" cx="50" cy="50" />
                          <circle
                            stroke="#0d6efd"
                            strokeWidth="10"
                            strokeLinecap="round"
                            fill="transparent"
                            r="40"
                            cx="50"
                            cy="50"
                            strokeDasharray={circleLength}
                            strokeDashoffset={offset}
                            style={{ transition: "stroke-dashoffset 0.5s" }}
                          />
                        </svg>
                        <div className="position-absolute top-50 start-50 translate-middle">
                          <span className="h3 fw-bold text-primary">{percent}%</span>
                        </div>
                      </div>
                      {/* Sửa lỗi DOM: không dùng <div> trong <p> */}
                      <div className="text-secondary">
                        {currentGoal ? (
                          <div className="text-start small">
                            <div><b>Ngày bắt đầu:</b> {currentGoal.startDate ? new Date(currentGoal.startDate).toLocaleDateString() : "?"}</div>
                            <div><b>Ngày mục tiêu:</b> {currentGoal.targetQuitDate ? new Date(currentGoal.targetQuitDate).toLocaleDateString() : "?"}</div>
                            <div><b>Động lực:</b> {currentGoal.personalMotivation || "Chưa nhập"}</div>
                            <div><b>Số ngày không hút:</b> {currentGoal.smokeFreeDays}</div>
                            <div><b>Tổng số ngày mục tiêu:</b> {currentGoal.totalDays}</div>
                            <div><b>Tổng số điếu đã hút:</b> {currentGoal.totalCigarettesSmoked}</div>
                            <div><b>Tổng tiền đã chi:</b> {currentGoal.totalSpenMoney?.toLocaleString() || 0}đ</div>
                            <div><b>Tiền hôm nay:</b> {currentGoal.todaySpent?.toLocaleString() || 0}đ</div>
                            <div><b>Tiền hôm qua:</b> {currentGoal.yesterdaySpent?.toLocaleString() || 0}đ</div>
                            <div><b>Ngày thứ:</b> {currentGoal.dayNumber} trong mục tiêu</div>
                            <div><b>Các ngày thiếu nhật ký:</b> {Array.isArray(currentGoal.missingLogDates) && currentGoal.missingLogDates.length > 0
                              ? currentGoal.missingLogDates.join(", ")
                              : "Không có"}
                            </div>
                          </div>
                        ) : (
                          <>Bạn đã hoàn thành {percent}% mục tiêu {plan?.goalDays || 60} ngày không thuốc lá</>
                        )}
                      </div>
                      <button className="btn btn-primary mt-3" onClick={() => setShowForm(!showForm)}>
                        {showForm ? "Đóng" : "Tạo tiến trình"}
                      </button>
                      {showForm && (
                        <form onSubmit={handleSubmitProgress}>
                          <label>
                            Số điếu thuốc hút hôm nay:
                            <input
                              type="number"
                              min="0"
                              value={todayCigarettes}
                              onChange={(e) => setTodayCigarettes(e.target.value)}
                              required
                              style={{ marginLeft: 8, width: 60 }}
                            />
                          </label>
                          <div style={{ display: "flex", alignItems: "center", marginTop: 8 }}>
                            <label style={{ marginBottom: 0 }}>
                              Giá tiền/bao:&nbsp;
                              <input
                                type="number"
                                min="1000"
                                step="1000"
                                value={pricePerPack}
                                onChange={e => setPricePerPack(e.target.value)}
                                required
                                style={{ width: 80, marginRight: 4 }}
                              />
                            </label>
                            <span>VNĐ/bao</span>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", marginTop: 8 }}>
                            <label style={{ marginBottom: 0 }}>
                              Số điếu/bao:&nbsp;
                              <input
                                type="number"
                                min="1"
                                max="30"
                                value={cigarettesPerPack}
                                onChange={e => setCigarettesPerPack(e.target.value)}
                                required
                                style={{ width: 60, marginRight: 4 }}
                              />
                            </label>
                            <span>điếu</span>
                          </div>
                          <button type="submit" className="btn btn-success ms-3">
                            Ghi nhận
                          </button>
                        </form>
                      )}
                    </div>
                  </div>
                </div>

                {/* Recent Achievements */}
                <div className="mt-5">
                  <h3 className="fs-5 fw-semibold mb-3">Thành tích gần đây</h3>
                  <div className="row g-3">
                    {getAchievedBadges(progress).map((badge, idx) => (
                      <div className="col-6 col-sm-4 col-md-2" key={badge.key}>
                        <div className="bg-warning bg-opacity-10 p-3 rounded-3 shadow-sm text-center">
                          <div className="bg-warning bg-opacity-25 rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2" style={{ width: "48px", height: "48px" }}>
                            <i className={`${badge.icon} text-warning fs-4`}></i>
                          </div>
                          <div className="small fw-medium">{badge.label}</div>
                          <button className="btn btn-link btn-sm mt-2" onClick={() => shareBadge(badge)}>
                            Chia sẻ
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Gợi ý bài viết cá nhân hóa */}
                <div className="mt-5">
                  <h4>Gợi ý cho bạn</h4>
                  {getPersonalizedTips(progress.daysNoSmoke).map((tip, idx) => (
                    <div key={idx} className="alert alert-info">
                      <b>{tip.title}</b>: {tip.content}
                    </div>
                  ))}
                </div>

                {/* Bảng tin cộng đồng */}
                <div className="mt-5">
                  <h4>Bảng tin cộng đồng</h4>
                  {(JSON.parse(localStorage.getItem("sharedBadges") || "[]")).reverse().map((item, idx) => {
                    const encourages = JSON.parse(localStorage.getItem("encourages") || "{}");
                    const comments = JSON.parse(localStorage.getItem("badgeComments") || "{}");
                    return (
                      <div key={idx} className="border rounded p-2 mb-2 bg-light">
                        <b>{item.user}</b> đã chia sẻ huy hiệu <span className="text-primary">{item.badge}</span> lúc {item.time}
                        <button
                          className="btn btn-sm btn-outline-success ms-2"
                          onClick={() => handleEncourage(idx)}
                        >
                          Động viên
                        </button>
                        <span className="ms-2 text-success">
                          {encourages[idx] ? `${encourages[idx]} lượt động viên` : ""}
                        </span>
                        {/* Form bình luận */}
                        <div className="mt-2">
                          <input
                            type="text"
                            placeholder="Viết bình luận..."
                            value={commentInputs[idx] || ""}
                            onChange={e => setCommentInputs({ ...commentInputs, [idx]: e.target.value })}
                            style={{ width: "70%", marginRight: 8 }}
                          />
                          <button
                            className="btn btn-sm btn-primary"
                            aria-label="Gửi bình luận"
                            onClick={() => {
                              if ((commentInputs[idx] || "").trim()) {
                                handleAddComment(idx, commentInputs[idx]);
                                setCommentInputs({ ...commentInputs, [idx]: "" }); // Xóa input sau khi gửi
                              }
                            }}
                          >
                            Gửi
                          </button>
                        </div>
                        {/* Danh sách bình luận */}
                        {comments[idx] && comments[idx].length > 0 && (
                          <div className="mt-2">
                            {comments[idx].map((c, cIdx) => (
                              <div key={cIdx} className="small text-secondary">
                                {c.text} <span className="text-muted">({c.time})</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Motivation */}
                <div className="mt-5 bg-light p-4 rounded-3 shadow-sm">
                  <div className="d-flex align-items-start">
                    <div className="bg-primary rounded-circle p-3 text-white me-3 d-flex align-items-center justify-content-center" style={{ width: "48px", height: "48px" }}>
                      <i className="fas fa-lightbulb fs-4"></i>
                    </div>
                    <div>
                      <h3 className="fs-5 fw-semibold mb-2">Thông điệp động viên</h3>
                      <p className="mb-1 text-secondary">Hôm nay là ngày thứ 34 không hút thuốc của bạn! Hãy nhớ rằng mỗi ngày không thuốc lá là một chiến thắng. Bạn đã tiết kiệm được 2,380,000đ và tránh được 476 điếu thuốc.</p>
                      <p className="mb-0 text-secondary">Tiếp tục phát huy! Sức khỏe của bạn đã cải thiện đáng kể sau khi bỏ thuốc.</p>
                    </div>
                  </div>
                </div>

                {/* Biểu đồ tiến trình */}
                <div className="my-4">
                  <h4>Biểu đồ tiến trình</h4>
                  <Line
                    key={chartLabels.join(",")}
                    data={{
                      labels: chartLabels.length > 0 ? chartLabels : ["Ngày 1"],
                      datasets: [
                        {
                          label: "Số ngày không hút (theo nhật ký)",
                          data: chartData.length > 0 ? chartData : [0],
                          fill: false,
                          borderColor: "#1976d2",
                          tension: 0.1,
                        },
                      ],
                    }}
                    height={120}
                  />
                </div>

                {/* Thống kê nâng cao */}
                <div className="row g-4 mt-4">
                  <div className="col-md-4">
                    <div className="bg-light p-3 rounded-3 shadow-sm text-center">
                      <div className="fw-semibold">Chuỗi ngày không hút dài nhất</div>
                      <div className="display-6 text-success">{maxStreak} ngày</div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="bg-light p-3 rounded-3 shadow-sm text-center">
                      <div className="fw-semibold">Số lần tái nghiện</div>
                      <div className="display-6 text-danger">{relapseCount}</div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="bg-light p-3 rounded-3 shadow-sm text-center">
                      <div className="fw-semibold">Tổng tiền tiết kiệm được</div>
                      <div className="display-6 text-primary">{totalMoneySaved.toLocaleString()}đ</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "plan" && (
              <div>
                <h3 className="fs-5 fw-semibold mb-3">Kế hoạch cai thuốc</h3>
                {/* Hiển thị kế hoạch hiện tại */}
                <div className="mb-4">
                  <h5>Chi tiết kế hoạch hiện tại:</h5>
                  <ul>
                    <li><b>Mục tiêu số ngày không hút:</b> {plan?.goalDays || "Chưa đặt"} ngày</li>
                    <li><b>Lý do bỏ thuốc:</b> {plan?.reason || "Chưa nhập"}</li>
                    <li><b>Tần suất nhắc nhở:</b> {plan?.reminderFrequency || "Chưa chọn"}</li>
                  </ul>
                </div>
                {/* Form chỉnh sửa kế hoạch */}
                <form
                  onSubmit={async e => {
                    e.preventDefault();
                    const newPlan = {
                      goalDays: e.target.goalDays.value,
                      reason: e.target.reason.value,
                      reminderFrequency: e.target.reminderFrequency.value,
                    };
                    await handleUpdatePlan(newPlan);
                  }}
                  className="border rounded p-3 bg-light"
                  style={{ maxWidth: 400 }}
                >
                  <h6>Cập nhật kế hoạch</h6>
                  <div className="mb-2">
                    <label>Mục tiêu số ngày:&nbsp;
                      <input
                        type="number"
                        name="goalDays"
                        min="1"
                        defaultValue={plan?.goalDays || 60}
                        required
                        className="form-control"
                      />
                    </label>
                  </div>
                  <div className="mb-2">
                    <label>Lý do bỏ thuốc:&nbsp;
                      <input
                        type="text"
                        name="reason"
                        defaultValue={plan?.reason || ""}
                        required
                        className="form-control"
                      />
                    </label>
                  </div>
                  <div className="mb-2">
                    <label>Tần suất nhắc nhở:&nbsp;
                      <select
                        name="reminderFrequency"
                        defaultValue={plan?.reminderFrequency || "daily"}
                        className="form-control"
                      >
                        <option value="daily">Hàng ngày</option>
                        <option value="weekly">Hàng tuần</option>
                        <option value="monthly">Hàng tháng</option>
                      </select>
                    </label>
                  </div>
                  <button type="submit" className="btn btn-primary mt-2">Lưu kế hoạch</button>
                </form>

                {/* Danh sách mục tiêu của bạn */}
                {memberGoals.length > 0 && (
                  <div className="mt-4">
                    <h5>Danh sách mục tiêu của bạn</h5>
                    <ul>
                      {memberGoals.map(goal => (
                        <li key={goal.memberGoalId}>
                          <b>Goal ID:</b> {goal.goalId} | <b>Status:</b> {goal.status}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {activeTab === "journal" && (
              <div>
                <h3 className="fs-5 fw-semibold mb-3">Nhật ký cai thuốc</h3>
                <p className="text-secondary">
                  Ghi lại cảm xúc, khó khăn, thành công mỗi ngày để theo dõi tiến trình và nhận lời khuyên phù hợp.
                </p>

                {/* Form nhập nhật ký */}
                <form onSubmit={handleJournalSubmit} className="mb-4">
                  <div className="mb-2">
                    <label>
                      Ngày:&nbsp;
                      <input
                        type="date"
                        value={journalDate}
                        onChange={e => setJournalDate(e.target.value)}
                        required
                        style={{ borderRadius: 6, border: "1px solid #ccc", padding: "4px 8px" }}
                      />
                    </label>
                  </div>
                  <textarea
                    className="form-control mb-2"
                    rows={3}
                    placeholder="Nhập cảm xúc, khó khăn hoặc thành công hôm nay..."
                    value={journalEntry}
                    onChange={e => setJournalEntry(e.target.value)}
                    required
                  />
                  <button type="submit" className="btn btn-primary">
                    Lưu nhật ký
                  </button>
                </form>

                {/* Bộ lọc theo tháng */}
                <div className="mb-3">
                  <label>
                    Lọc theo tháng:&nbsp;
                    <input
                      type="month"
                      value={filterMonth}
                      onChange={e => setFilterMonth(e.target.value)}
                      style={{ borderRadius: 6, border: "1px solid #ccc", padding: "4px 8px" }}
                    />
                  </label>
                </div>

                {/* Hiển thị danh sách nhật ký */}
                <div>
                  <h5 className="mb-3">Lịch sử nhật ký</h5>
                  {journal.length === 0 && <div className="text-secondary">Chưa có nhật ký nào.</div>}
                  {journal
                    .filter(entry => !filterMonth || entry.date.startsWith(filterMonth))
                    .slice().reverse().map((entry, idx) => (
                      <div key={idx} className="border rounded p-2 mb-2 bg-light">
                        <b>{entry.date}</b>:&nbsp;
                        {editIdx === idx ? (
                          // --- FORM CẬP NHẬT NHẬT KÝ ---
                          <form
                            style={{ display: "inline-block", width: "100%" }}
                            onSubmit={async (e) => {
                              e.preventDefault();
                              try {
                                await api.put("/ProgressLog/UpdateProgress-log", {
                                  logDate: e.target.logDate.value,
                                  cigarettesSmoked: Number(e.target.cigarettesSmoked.value),
                                  pricePerPack: Number(e.target.pricePerPack.value),
                                  cigarettesPerPack: Number(e.target.cigarettesPerPack.value),
                                  mood: e.target.mood.value,
                                  notes: e.target.notes.value,
                                });
                                toast.success("Đã cập nhật nhật ký!");
                                // Reload lại nhật ký
                                const res = await api.get("/ProgressLog/GetProgress-logs");
                                setJournal(res.data);
                                setEditIdx(null);
                              } catch {
                                toast.error("Cập nhật thất bại!");
                              }
                            }}
                          >
                            <div className="row g-2">
                              <div className="col">
                                <input
                                  type="date"
                                  name="logDate"
                                  defaultValue={entry.logDate || entry.date}
                                  className="form-control"
                                  required
                                />
                              </div>
                              <div className="col">
                                <input
                                  type="number"
                                  name="cigarettesSmoked"
                                  min="0"
                                  defaultValue={entry.cigarettesSmoked}
                                  className="form-control"
                                  placeholder="Điếu hút"
                                  required
                                />
                              </div>
                              <div className="col">
                                <input
                                  type="number"
                                  name="pricePerPack"
                                  min="0"
                                  defaultValue={entry.pricePerPack}
                                  className="form-control"
                                  placeholder="Giá/bao"
                                  required
                                />
                              </div>
                              <div className="col">
                                <input
                                  type="number"
                                  name="cigarettesPerPack"
                                  min="1"
                                  defaultValue={entry.cigarettesPerPack || 20}
                                  className="form-control"
                                  placeholder="Điếu/bao"
                                  required
                                />
                              </div>
                              <div className="col">
                                <input
                                  type="text"
                                  name="mood"
                                  defaultValue={entry.mood || ""}
                                  className="form-control"
                                  placeholder="Cảm xúc"
                                />
                              </div>
                              <div className="col">
                                <input
                                  type="text"
                                  name="notes"
                                  defaultValue={entry.notes || entry.content || ""}
                                  className="form-control"
                                  placeholder="Ghi chú"
                                />
                              </div>
                              <div className="col-auto">
                                <button type="submit" className="btn btn-success btn-sm">Lưu</button>
                                <button type="button" className="btn btn-secondary btn-sm ms-1" onClick={() => setEditIdx(null)}>Hủy</button>
                              </div>
                            </div>
                          </form>
                        ) : (
                          <>
                            {entry.content}
                            <button className="btn btn-sm btn-outline-primary ms-2" onClick={() => setEditIdx(idx)}>Sửa</button>
                            <button className="btn btn-sm btn-outline-danger ms-1" onClick={async () => {
                              if (window.confirm("Bạn chắc chắn muốn xóa nhật ký này?")) {
                                try {
                                  await api.delete(`/ProgressLog/DeleteByIdProgress-log/${entry.logId}`);
                                  toast.success("Đã xóa nhật ký!");
                                  // Reload lại nhật ký
                                  const res = await api.get("/ProgressLog/GetProgress-logs");
                                  setJournal(res.data);
                                } catch {
                                  toast.error("Xóa nhật ký thất bại!");
                                }
                              }
                            }}>Xóa</button>
                          </>
                        )}
                      </div>
                    ))}
                </div>

                {/* Biểu đồ tiến trình theo nhật ký */}
                <div className="my-4">
                  <h5>Biểu đồ tiến trình (theo nhật ký)</h5>
                  <Line
                    key={chartLabels.join(",")} // Thêm prop key để tránh lỗi canvas
                    data={{
                      labels: chartLabels.length > 0 ? chartLabels : ["Ngày 1"],
                      datasets: [
                        {
                          label: "Số ngày ghi nhật ký",
                          data: chartData.length > 0 ? chartData : [0],
                          fill: false,
                          borderColor: "#43a047",
                          tension: 0.1,
                        },
                      ],
                    }}
                    height={120}
                  />
                </div>
              </div>
            )}
            {activeTab === "achievements" && (
              <div>
                <h3 className="fs-5 fw-semibold mb-3">Thành tích & Huy hiệu</h3>
                <div className="row g-3">
                  {getAchievedBadges(progress).map((badge, idx) => (
                    <div className="col-6 col-sm-4 col-md-2" key={badge.key}>
                      <div className="bg-warning bg-opacity-10 p-3 rounded-3 shadow-sm text-center">
                        <div className="bg-warning bg-opacity-25 rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2" style={{ width: "48px", height: "48px" }}>
                          <i className={`${badge.icon} text-warning fs-4`}></i>
                        </div>
                        <div className="small fw-medium">{badge.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeTab === "report" && (
              <div>
                <h3 className="fs-5 fw-semibold mb-3">Báo cáo nâng cao</h3>
                <div className="row">
                  <div className="col-md-6">
                    <h5>Xu hướng tiến trình</h5>
                    <Line
                      data={{
                        labels: chartLabels.length > 0 ? chartLabels : ["Ngày 1"],
                        datasets: [
                          {
                            label: "Số ngày không hút (cộng dồn)",
                            data: chartData.length > 0 ? chartData : [0],
                            fill: false,
                            borderColor: "#1976d2",
                            tension: 0.1,
                          },
                          {
                            label: "Trung bình cộng đồng",
                            data: chartLabels.map(() => communityAvg.daysNoSmoke),
                            borderDash: [5, 5],
                            borderColor: "#aaa",
                            fill: false,
                          },
                        ],
                      }}
                      height={120}
                    />
                  </div>
                  <div className="col-md-6">
                    <h5>So sánh với cộng đồng</h5>
                    <ul>
                      <li>Số ngày không hút: <b>{progress.daysNoSmoke}</b> (Cộng đồng: {communityAvg.daysNoSmoke})</li>
                      <li>Tiền tiết kiệm: <b>{progress.moneySaved.toLocaleString()}đ</b> (Cộng đồng: {communityAvg.moneySaved.toLocaleString()}đ)</li>
                      <li>Cải thiện sức khỏe: <b>{progress.health}%</b> (Cộng đồng: {communityAvg.health}%)</li>
                    </ul>
                    <button className="btn btn-outline-primary mt-3" onClick={exportCSV}>
                      <i className="fas fa-file-csv me-2"></i>Xuất nhật ký CSV
                    </button>
                  </div>
                </div>

                {/* Lịch sử các chuỗi cai thuốc */}
                <div className="mt-4">
                  <h5>Lịch sử các chuỗi cai thuốc</h5>
                  {quitHistory.length === 0 && <div className="text-secondary">Chưa có chuỗi nào.</div>}
                  {quitHistory.slice().reverse().map((item, idx) => (
                    <div key={idx} className="border rounded p-2 mb-2 bg-light">
                      <div><b>Chuỗi #{quitHistory.length - idx}</b></div>
                      <div>Ngày bắt đầu: <b>{item.startDate ? new Date(item.startDate).toLocaleDateString() : "?"}</b></div>
                      <div>Ngày kết thúc: <b>{item.endDate ? new Date(item.endDate).toLocaleDateString() : "?"}</b></div>
                      <div>Số ngày không hút: <b>{item.daysNoSmoke}</b></div>
                      <div>Tiền tiết kiệm: <b>{item.moneySaved.toLocaleString()}đ</b></div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {activeTab === "systemreport" && (
              <div>
                <SystemReportForm />
                <NotificationHistory />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;