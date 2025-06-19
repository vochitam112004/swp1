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
      d.setHours(0,0,0,0);
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

const Dashboard = () => {
  // Thêm state cho tiến trình
  const [progress, setProgress] = useState(() => {
    // Lấy từ localStorage nếu có
    const saved = localStorage.getItem("quitProgress");
    return saved
      ? JSON.parse(saved)
      : { startDate: null, daysNoSmoke: 0, moneySaved: 0, health: 0 };
  });
  const [todayCigarettes, setTodayCigarettes] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [journal, setJournal] = useState(() => {
    // Đọc nhật ký từ localStorage
    return JSON.parse(localStorage.getItem("quitJournal") || "[]");
  });
  const [journalEntry, setJournalEntry] = useState("");
  const [journalDate, setJournalDate] = useState(() => {
    // Mặc định là hôm nay
    return new Date().toISOString().slice(0, 10);
  });
  const [frequency, setFrequency] = useState(() => localStorage.getItem("smokeFrequency") || "");
  const [pricePerPack, setPricePerPack] = useState(() => localStorage.getItem("pricePerPack") || "");

  // Hàm ghi nhận tiến trình mỗi ngày
  const handleSubmitProgress = (e) => {
    e.preventDefault();
    localStorage.setItem("smokeFrequency", frequency);
    localStorage.setItem("pricePerPack", pricePerPack);
    const now = new Date();
    let startDate = progress.startDate
      ? new Date(progress.startDate)
      : now;
    if (!progress.startDate) startDate = now;
    // Giả sử mỗi ngày không hút tiết kiệm 70.000đ, cải thiện 2% sức khỏe
    const daysNoSmoke =
      todayCigarettes === "0"
        ? Math.floor((now - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1
        : 0;
    const moneySaved = daysNoSmoke * 70000;
    const health = Math.min(daysNoSmoke * 2, 100);
    const newProgress = {
      startDate: startDate.toISOString(),
      daysNoSmoke,
      moneySaved,
      health,
    };
    setProgress(newProgress);
    localStorage.setItem("quitProgress", JSON.stringify(newProgress));
    setShowForm(false);
    setTodayCigarettes("");
  };

  // Hàm lưu nhật ký
  const handleJournalSubmit = (e) => {
    e.preventDefault();
    if (!journalEntry.trim()) return;
    const newEntry = {
      date: journalDate,
      content: journalEntry,
    };
    const updatedJournal = [...journal, newEntry];
    setJournal(updatedJournal);
    localStorage.setItem("quitJournal", JSON.stringify(updatedJournal));
    setJournalEntry("");
    toast.success("Đã lưu nhật ký!");
  };

  // Dữ liệu cho biểu đồ tiến trình (số ngày không hút liên tục)
  const chartLabels = journal.map(j => j.date);
  const chartData = journal.map((j, idx) => idx + 1);

  // Thông báo mỗi ngày 1 lần
  useEffect(() => {
    const lastNotify = localStorage.getItem("lastMotivationNotify");
    const today = new Date().toISOString().slice(0, 10);
    if (lastNotify !== today) {
      toast.info("Hãy nhớ lý do bạn bắt đầu! Mỗi ngày không thuốc lá là một chiến thắng mới 💪");
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
                      <div className="d-flex align-items-center justify-content-center" style={{height: "250px", background: "#f5f6fa", borderRadius: "1rem"}}>
                        <span className="text-secondary">Biểu đồ tiến trình sẽ hiển thị tại đây</span>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="bg-white p-4 rounded-3 shadow-sm border text-center">
                      <h3 className="fs-5 fw-semibold mb-3">Mục tiêu hiện tại</h3>
                      <div className="position-relative mx-auto mb-3" style={{width: "160px", height: "160px"}}>
                        <svg width="160" height="160" viewBox="0 0 100 100">
                          <circle stroke="#e9ecef" strokeWidth="10" fill="transparent" r="40" cx="50" cy="50" />
                          <circle stroke="#0d6efd" strokeWidth="10" strokeLinecap="round" fill="transparent" r="40" cx="50" cy="50" strokeDasharray="251.2" strokeDashoffset="100.48" />
                        </svg>
                        <div className="position-absolute top-50 start-50 translate-middle">
                          <span className="h3 fw-bold text-primary">60%</span>
                        </div>
                      </div>
                      <p className="text-secondary">Bạn đã hoàn thành 60% mục tiêu 60 ngày không thuốc lá</p>
                      <button className="btn btn-primary mt-3" onClick={() => setShowForm(!showForm)}>
                        {showForm ? "Đóng" : "Cập nhật tiến trình"}
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
                          <div>
                            <label>
                              Tần suất hút/ngày:&nbsp;
                              <input
                                type="number"
                                min="1"
                                value={frequency}
                                onChange={e => setFrequency(e.target.value)}
                                required
                              />
                              &nbsp;điếu/ngày
                            </label>
                          </div>
                          <div>
                            <label>
                              Giá tiền/bao:&nbsp;
                              <input
                                type="number"
                                min="1000"
                                step="1000"
                                value={pricePerPack}
                                onChange={e => setPricePerPack(e.target.value)}
                                required
                              />
                              &nbsp;VNĐ/bao
                            </label>
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
                          <div className="bg-warning bg-opacity-25 rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2" style={{width: "48px", height: "48px"}}>
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

                {/* Bảng tin cộng đồng */}
                <div className="mt-5">
                  <h4>Bảng tin cộng đồng</h4>
                  {(JSON.parse(localStorage.getItem("sharedBadges") || "[]")).reverse().map((item, idx) => (
                    <div key={idx} className="border rounded p-2 mb-2 bg-light">
                      <b>{item.user}</b> đã chia sẻ huy hiệu <span className="text-primary">{item.badge}</span> lúc {item.time}
                      <button className="btn btn-sm btn-outline-success ms-2">Động viên</button>
                    </div>
                  ))}
                </div>

                {/* Motivation */}
                <div className="mt-5 bg-light p-4 rounded-3 shadow-sm">
                  <div className="d-flex align-items-start">
                    <div className="bg-primary rounded-circle p-3 text-white me-3 d-flex align-items-center justify-content-center" style={{width: "48px", height: "48px"}}>
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
              </div>
            )}
            {activeTab === "plan" && (
              <div>
                <h3 className="fs-5 fw-semibold mb-3">Kế hoạch cai thuốc</h3>
                <ul>
                  <li>Đặt mục tiêu số ngày không hút thuốc</li>
                  <li>Chia nhỏ mục tiêu thành các giai đoạn (1 ngày, 1 tuần, 1 tháng...)</li>
                  <li>Nhận nhắc nhở và động viên tự động</li>
                </ul>
                <p className="text-secondary">Bạn có thể cập nhật mục tiêu mới bất cứ lúc nào.</p>
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

                {/* Hiển thị danh sách nhật ký */}
                <div>
                  <h5 className="mb-3">Lịch sử nhật ký</h5>
                  {journal.length === 0 && <div className="text-secondary">Chưa có nhật ký nào.</div>}
                  {journal.slice().reverse().map((entry, idx) => (
                    <div key={idx} className="border rounded p-2 mb-2 bg-light">
                      <b>{entry.date}</b>: {entry.content}
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
                        <div className="bg-warning bg-opacity-25 rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2" style={{width: "48px", height: "48px"}}>
                          <i className={`${badge.icon} text-warning fs-4`}></i>
                        </div>
                        <div className="small fw-medium">{badge.label}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;