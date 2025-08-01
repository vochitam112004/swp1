// Dashboard constants and configurations
export const BADGES = [
  // Theo ngày không hút thuốc
  {
    key: "1day",
    label: "1 ngày không hút",
    icon: "fas fa-calendar-check",
    condition: (p) => p.daysNoSmoke >= 1,
  },
  {
    key: "3days",
    label: "3 ngày không hút",
    icon: "fas fa-check-circle",
    condition: (p) => p.daysNoSmoke >= 3,
  },
  {
    key: "7days",
    label: "1 tuần không hút",
    icon: "fas fa-trophy",
    condition: (p) => p.daysNoSmoke >= 7,
  },
  {
    key: "14days",
    label: "2 tuần không hút",
    icon: "fas fa-heartbeat",
    condition: (p) => p.daysNoSmoke >= 14,
  },
  {
    key: "30days",
    label: "30 ngày không hút",
    icon: "fas fa-award",
    condition: (p) => p.daysNoSmoke >= 30,
  },
  {
    key: "90days",
    label: "3 tháng không hút",
    icon: "fas fa-medal",
    condition: (p) => p.daysNoSmoke >= 90,
  },
  {
    key: "180days",
    label: "6 tháng không hút",
    icon: "fas fa-star",
    condition: (p) => p.daysNoSmoke >= 180,
  },
  {
    key: "365days",
    label: "1 năm không hút",
    icon: "fas fa-crown",
    condition: (p) => p.daysNoSmoke >= 365,
  },

  // Theo số tiền tiết kiệm
  {
    key: "100k",
    label: "Tiết kiệm 100K",
    icon: "fas fa-piggy-bank",
    condition: (p) => p.moneySaved >= 100000,
  },
  {
    key: "500k",
    label: "Tiết kiệm 500K",
    icon: "fas fa-wallet",
    condition: (p) => p.moneySaved >= 500000,
  },
  {
    key: "1tr",
    label: "Tiết kiệm 1 triệu",
    icon: "fas fa-coins",
    condition: (p) => p.moneySaved >= 1000000,
  },
  {
    key: "5tr",
    label: "Tiết kiệm 5 triệu",
    icon: "fas fa-gem",
    condition: (p) => p.moneySaved >= 5000000,
  },
  {
    key: "10tr",
    label: "Tiết kiệm 10 triệu",
    icon: "fas fa-diamond",
    condition: (p) => p.moneySaved >= 10000000,
  },

  // Theo sức khỏe
  {
    key: "health1",
    label: "Sức khỏe cải thiện rõ rệt",
    icon: "fas fa-heart",
    condition: (p) => p.healthImproved >= 20,
  },
  {
    key: "health2",
    label: "Sức khỏe hồi phục vượt bậc",
    icon: "fas fa-lungs",
    condition: (p) => p.healthImproved >= 50,
  },

  // Theo số ngày ghi nhật ký
  {
    key: "journal5",
    label: "Ghi nhật ký 5 ngày",
    icon: "fas fa-pen",
    condition: (p) => p.journalCount >= 5,
  },
  {
    key: "journal20",
    label: "Ghi nhật ký 20 ngày",
    icon: "fas fa-book",
    condition: (p) => p.journalCount >= 20,
  },
];

export const TIPS = [
  {
    minDay: 0,
    maxDay: 3,
    title: "Vượt qua 3 ngày đầu",
    content:
      "3 ngày đầu là khó khăn nhất. Hãy uống nhiều nước và tránh môi trường có khói thuốc.",
  },
  {
    minDay: 4,
    maxDay: 7,
    title: "Giữ vững quyết tâm",
    content:
      "Bạn đã vượt qua giai đoạn khó nhất. Hãy chia sẻ với bạn bè để được động viên.",
  },
  {
    minDay: 8,
    maxDay: 30,
    title: "Tạo thói quen mới",
    content:
      "Hãy thử tập thể dục hoặc học kỹ năng mới để quên đi cảm giác thèm thuốc.",
  },
  {
    minDay: 31,
    maxDay: 1000,
    title: "Duy trì thành quả",
    content: "Tiếp tục duy trì lối sống lành mạnh và tự thưởng cho bản thân.",
  },
];

export const COMMUNITY_AVG = {
  daysNoSmoke: 18,
  moneySaved: 1260000,
  health: 36,
};

export const TABS = {
  OVERVIEW: "overview",
  PLAN: "plan",
  PLAN_HISTORY: "planhistory",
  JOURNAL: "journal",
  BADGES: "badges",
  APPOINTMENT: "appointment",
  SYSTEM_REPORT: "systemreport",
  NOTIFICATIONS: "notifications",
};
