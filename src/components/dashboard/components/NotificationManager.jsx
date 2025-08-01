// Notification management component
import React, { useEffect } from "react";
import { toast } from "react-toastify";
import NotificationHistory from "../NotificationHistory";
import { 
  requestNotificationPermission, 
  sendBrowserNotification, 
  shouldSendReminder,
  getPersonalizedTips 
} from "../utils/dashboardUtils";

const NotificationManager = ({ progress, plan }) => {
  // Thông báo mỗi ngày 1 lần
  useEffect(() => {
    requestNotificationPermission();
    const lastNotify = localStorage.getItem("lastMotivationNotify");
    const today = new Date().toISOString().slice(0, 10);
    if (lastNotify !== today) {
      toast.info(
        "Hãy nhớ lý do bạn bắt đầu! Mỗi ngày không thuốc lá là một chiến thắng mới 💪"
      );
      sendBrowserNotification(
        "Động viên cai thuốc",
        "Hãy nhớ lý do bạn bắt đầu! Mỗi ngày không thuốc lá là một chiến thắng mới 💪"
      );
      localStorage.setItem("lastMotivationNotify", today);
    }
  }, []);

  // Thông báo động viên cá nhân
  useEffect(() => {
    // Lấy kế hoạch từ localStorage hoặc từ props
    const localPlan = JSON.parse(localStorage.getItem("quitPlan") || "{}");
    const currentPlan = plan || localPlan;
    
    const reason = currentPlan.reason || "Hãy nhớ lý do bạn bắt đầu!";
    const frequency = currentPlan.reminderFrequency || "daily";
    const lastNotify = localStorage.getItem("lastPersonalReasonNotify");
    
    if (shouldSendReminder(lastNotify, frequency)) {
      toast.info(`Động viên: ${reason}`);
      sendBrowserNotification("Động viên cai thuốc", reason);
      localStorage.setItem(
        "lastPersonalReasonNotify",
        new Date().toISOString()
      );
    }
  }, [plan]);

  // Thông báo lời khuyên cá nhân hóa
  useEffect(() => {
    if (!progress?.daysNoSmoke) return;
    
    const tips = getPersonalizedTips(progress.daysNoSmoke);
    if (tips.length === 0) return;
    
    const lastTipDate = localStorage.getItem("lastTipDate");
    const today = new Date().toISOString().slice(0, 10);
    
    if (lastTipDate !== today) {
      const randomTip = tips[Math.floor(Math.random() * tips.length)];
      setTimeout(() => {
        toast.info(`💡 ${randomTip.title}: ${randomTip.content}`);
        sendBrowserNotification(
          `💡 ${randomTip.title}`,
          randomTip.content,
          "health"
        );
      }, 2000); // Delay 2 giây để không spam notification
      
      localStorage.setItem("lastTipDate", today);
    }
  }, [progress]);

  const renderNotificationSettings = () => {
    const settings = JSON.parse(
      localStorage.getItem("notificationSettings") || 
      JSON.stringify({
        enableBrowserNotifications: true,
        enableMotivationMessages: true,
        enableHealthTips: true,
        enableMilestoneNotifications: true,
        enableAchievementNotifications: true,
      })
    );

    const updateSetting = (key, value) => {
      const newSettings = { ...settings, [key]: value };
      localStorage.setItem("notificationSettings", JSON.stringify(newSettings));
      toast.info("Đã cập nhật cài đặt thông báo");
      // Force re-render bằng cách trigger state update ở parent component
      window.dispatchEvent(new Event('storage'));
    };

    return (
      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">
            <i className="fas fa-cog me-2" />
            Cài đặt thông báo
          </h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <div className="form-check form-switch mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="browserNotifications"
                  checked={settings.enableBrowserNotifications}
                  onChange={(e) => updateSetting("enableBrowserNotifications", e.target.checked)}
                />
                <label className="form-check-label" htmlFor="browserNotifications">
                  <i className="fas fa-bell me-2" />
                  Thông báo trình duyệt
                </label>
              </div>
              
              <div className="form-check form-switch mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="motivationMessages"
                  checked={settings.enableMotivationMessages}
                  onChange={(e) => updateSetting("enableMotivationMessages", e.target.checked)}
                />
                <label className="form-check-label" htmlFor="motivationMessages">
                  <i className="fas fa-heart me-2" />
                  Tin nhắn động viên
                </label>
              </div>
              
              <div className="form-check form-switch mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="healthTips"
                  checked={settings.enableHealthTips}
                  onChange={(e) => updateSetting("enableHealthTips", e.target.checked)}
                />
                <label className="form-check-label" htmlFor="healthTips">
                  <i className="fas fa-medkit me-2" />
                  Lời khuyên sức khỏe
                </label>
              </div>
            </div>
            
            <div className="col-md-6">
              <div className="form-check form-switch mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="milestoneNotifications"
                  checked={settings.enableMilestoneNotifications}
                  onChange={(e) => updateSetting("enableMilestoneNotifications", e.target.checked)}
                />
                <label className="form-check-label" htmlFor="milestoneNotifications">
                  <i className="fas fa-flag-checkered me-2" />
                  Thông báo cột mốc
                </label>
              </div>
              
              <div className="form-check form-switch mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="achievementNotifications"
                  checked={settings.enableAchievementNotifications}
                  onChange={(e) => updateSetting("enableAchievementNotifications", e.target.checked)}
                />
                <label className="form-check-label" htmlFor="achievementNotifications">
                  <i className="fas fa-trophy me-2" />
                  Thông báo thành tích
                </label>
              </div>

              <div className="alert alert-info">
                <i className="fas fa-info-circle me-2" />
                <small>
                  Để nhận thông báo trình duyệt, hãy cho phép thông báo khi được yêu cầu.
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderProgressStats = () => {
    if (!progress) return null;

    const tips = getPersonalizedTips(progress.daysNoSmoke);
    
    return (
      <div className="card mt-4">
        <div className="card-header">
          <h5 className="mb-0">
            <i className="fas fa-lightbulb me-2" />
            Lời khuyên dành cho bạn
          </h5>
        </div>
        <div className="card-body">
          {tips.length > 0 ? (
            <div className="row">
              {tips.map((tip, idx) => (
                <div key={idx} className="col-md-6 mb-3">
                  <div className="alert alert-info">
                    <h6 className="alert-heading">
                      <i className="fas fa-star me-2" />
                      {tip.title}
                    </h6>
                    <p className="mb-0">{tip.content}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-3">
              <i className="fas fa-graduation-cap text-muted" style={{ fontSize: "3rem" }} />
              <h5 className="mt-3 text-muted">Chưa có lời khuyên phù hợp</h5>
              <p className="text-muted">
                Lời khuyên sẽ xuất hiện dựa trên tiến trình của bạn
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="notification-manager">
      {renderNotificationSettings()}
      {renderProgressStats()}
      
      <div className="mt-4">
        <NotificationHistory />
      </div>
    </div>
  );
};

export default NotificationManager;
