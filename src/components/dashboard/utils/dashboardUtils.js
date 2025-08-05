// Dashboard utility functions
import { toast } from "react-toastify";
import { TIPS } from "../constants/dashboardConstants";
import { DateUtils } from "../../../utils/dateUtils";

/**
 * Đọc và parse localStorage an toàn
 */
export const safeParse = (key, fallback) => {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
};

/**
 * Lấy danh sách huy hiệu đã đạt dựa trên số tiền tiết kiệm (theo API mới)
 * @param {object} progress - Thông tin tiến trình (phải có moneySaved)
 * @param {array} badgeTemplates - Danh sách template (phải có requiredMoneySaved)
 * @returns {array} Danh sách badge đã đạt
 */
export const getAchievedBadges = (progress, badgeTemplates) => {
  if (!progress || !badgeTemplates) return [];

  const { moneySaved } = progress;

  return badgeTemplates
    .filter(t => moneySaved >= t.requiredMoneySaved)
    .map(t => ({
      key: t.templateId,
      label: t.name,
      icon: "fas fa-award", // icon mặc định (có thể cập nhật sau)
      description: t.description,
    }));
};

export const shouldSendReminder = (lastSent, frequency) => {
  const now = new Date();
  if (!lastSent) return true;
  const last = new Date(lastSent);
  if (frequency === "daily") {
    return now.toDateString() !== last.toDateString();
  }
  if (frequency === "weekly") {
    const getWeek = (d) => {
      d = new Date(d);
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - d.getDay() + 1);
      return d;
    };
    return getWeek(now).getTime() !== getWeek(last).getTime();
  }
  if (frequency === "monthly") {
    return (
      now.getMonth() !== last.getMonth() ||
      now.getFullYear() !== last.getFullYear()
    );
  }
  return false;
};

export const requestNotificationPermission = () => {
  if ("Notification" in window && Notification.permission === "default") {
    Notification.requestPermission();
  }
};

export const sendBrowserNotification = (title, body, type = "motivation") => {
  const settings = JSON.parse(
    localStorage.getItem("notificationSettings") || "{}"
  );
  if (settings.enableBrowserNotifications === false) return;
  if (type === "motivation" && settings.enableMotivationMessages === false)
    return;
  if (type === "health" && settings.enableHealthTips === false) return;
  if (type === "milestone" && settings.enableMilestoneNotifications === false)
    return;
  if (
    type === "achievement" &&
    settings.enableAchievementNotifications === false
  )
    return;

  if ("Notification" in window) {
    if (Notification.permission === "granted") {
      new Notification(title, { body });
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
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

  const history = JSON.parse(
    localStorage.getItem("notificationHistory") || "[]"
  );
  history.push({
    title,
    message: body,
    type,
    timestamp: Date.now(),
  });
  localStorage.setItem(
    "notificationHistory",
    JSON.stringify(history.slice(-100))
  );
};

export const getPersonalizedTips = (daysNoSmoke) => {
  return TIPS.filter(
    (tip) => daysNoSmoke >= tip.minDay && daysNoSmoke <= tip.maxDay
  );
};

/**
 * Tính toán tiến trình dựa trên log: ngày không hút, tiền tiết kiệm, sức khỏe
 * @param {array} progressLogs
 * @returns {object} { daysNoSmoke, moneySaved, health }
 */
export const calculateProgress = (progressLogs) => {
  let daysNoSmoke = 0;
  let moneySaved = 0;
  let health = 0;

  progressLogs.forEach((log) => {
    if (log.cigarettesSmoked === 0) daysNoSmoke += 1;
    moneySaved += log.moneySaved || 0; // Sửa: cộng đúng trường moneySaved từ log
  });

  health = Math.min(daysNoSmoke, 100);
  return { daysNoSmoke, moneySaved, health };
};

export const calculateGoalProgress = (currentGoal, plan) => {
  if (currentGoal && currentGoal.totalDays) {
    return Math.min(Math.round((currentGoal.smokeFreeDays / currentGoal.totalDays) * 100), 100);
  } else if (plan?.goalDays) {
    const progress = safeParse("quitProgress", { daysNoSmoke: 0 });
    return Math.min(Math.round((progress.daysNoSmoke / plan.goalDays) * 100), 100);
  }
  return Math.min(Math.round((safeParse("quitProgress", { daysNoSmoke: 0 }).daysNoSmoke / 60) * 100), 100);
};

export const getGoalDays = (plan) => {
  const normalizedPlan = DateUtils.normalizeFields(plan);

  if (normalizedPlan && normalizedPlan.startDate && normalizedPlan.targetQuitDate) {
    return DateUtils.daysDifference(normalizedPlan.targetQuitDate, normalizedPlan.startDate);
  }
  return 60; // default
};