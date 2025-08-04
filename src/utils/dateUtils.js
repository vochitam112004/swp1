export const DateUtils = {
  addDays: (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  },

  addWeeks: (date, weeks) => {
    return DateUtils.addDays(date, weeks * 7);
  },

  daysDifference: (endDate, startDate) => {
    const end = new Date(endDate);
    const start = new Date(startDate);
    end.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  },

  toISODateString: (date) => {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  },

  toVietnameseString: (date) => {
    if (!date) return "Không rõ";
    const d = new Date(date);
    return isNaN(d.getTime()) ? "Không rõ" : d.toLocaleDateString("vi-VN");
  },

  startOfDay: (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  },

  endOfDay: (date) => {
    const d = new Date(date);
    d.setHours(23, 59, 59, 999);
    return d;
  },

  isToday: (date) => {
    const today = new Date();
    const checkDate = new Date(date);
    return DateUtils.toISODateString(today) === DateUtils.toISODateString(checkDate);
  },

  getDateRange: (days) => {
    const endDate = new Date();
    const startDate = DateUtils.addDays(endDate, -days);
    return {
      startDate: DateUtils.startOfDay(startDate),
      endDate: DateUtils.endOfDay(endDate)
    };
  },

  normalizeFields: (obj) => {
    if (!obj) return obj;

    const normalizeDate = (value) => {
      if (!value || value === "0001-01-01T00:00:00") return null;
      const d = new Date(value);
      return isNaN(d) ? null : DateUtils.toISODateString(d);
    };

    return {
      ...obj,
      date: normalizeDate(obj.date || obj.logDate || obj.Date || obj.LogDate),
      startDate: normalizeDate(obj.startDate || obj.StartDate),
      endDate: normalizeDate(obj.endDate || obj.EndDate || obj.targetQuitDate || obj.TargetQuitDate),
      targetQuitDate: normalizeDate(obj.targetQuitDate || obj.TargetQuitDate),
      personalMotivation: obj.personalMotivation || obj.PersonalMotivation
    };
  }
};

export default DateUtils;
