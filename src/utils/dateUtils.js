// Date utility functions for safe date calculations
export const DateUtils = {
  /**
   * Safely add days to a date without month overflow issues
   * @param {Date|string} date - The starting date
   * @param {number} days - Number of days to add
   * @returns {Date} - New date with days added
   */
  addDays: (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  },

  /**
   * Safely add weeks to a date
   * @param {Date|string} date - The starting date
   * @param {number} weeks - Number of weeks to add
   * @returns {Date} - New date with weeks added
   */
  addWeeks: (date, weeks) => {
    return DateUtils.addDays(date, weeks * 7);
  },

  /**
   * Calculate difference in days between two dates
   * @param {Date|string} endDate - End date
   * @param {Date|string} startDate - Start date
   * @returns {number} - Number of days difference
   */
  daysDifference: (endDate, startDate) => {
    const end = new Date(endDate);
    const start = new Date(startDate);
    // Reset time to avoid timezone issues
    end.setHours(0, 0, 0, 0);
    start.setHours(0, 0, 0, 0);
    return Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  },

  /**
   * Format date to ISO string (YYYY-MM-DD)
   * @param {Date|string} date - Date to format
   * @returns {string} - Formatted date string
   */
  toISODateString: (date) => {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  },

  /**
   * Format date to Vietnamese locale
   * @param {Date|string} date - Date to format
   * @returns {string} - Formatted date string
   */
  toVietnameseString: (date) => {
    const d = new Date(date);
    return d.toLocaleDateString('vi-VN');
  },

  /**
   * Get start of day for a date (00:00:00)
   * @param {Date|string} date - Date to get start of day
   * @returns {Date} - Date at start of day
   */
  startOfDay: (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  },

  /**
   * Get end of day for a date (23:59:59)
   * @param {Date|string} date - Date to get end of day
   * @returns {Date} - Date at end of day
   */
  endOfDay: (date) => {
    const d = new Date(date);
    d.setHours(23, 59, 59, 999);
    return d;
  },

  /**
   * Check if a date is today
   * @param {Date|string} date - Date to check
   * @returns {boolean} - True if date is today
   */
  isToday: (date) => {
    const today = new Date();
    const checkDate = new Date(date);
    return DateUtils.toISODateString(today) === DateUtils.toISODateString(checkDate);
  },

  /**
   * Get date range for filtering (last N days)
   * @param {number} days - Number of days back
   * @returns {Object} - Object with startDate and endDate
   */
  getDateRange: (days) => {
    const endDate = new Date();
    const startDate = DateUtils.addDays(endDate, -days);
    return {
      startDate: DateUtils.startOfDay(startDate),
      endDate: DateUtils.endOfDay(endDate)
    };
  },

  /**
   * Normalize field names for date objects
   * @param {Object} obj - Object with date fields
   * @returns {Object} - Object with normalized field names
   */
  normalizeFields: (obj) => {
    if (!obj) return obj;
    
    return {
      ...obj,
      // Normalize date field
      date: obj.date || obj.logDate || obj.Date || obj.LogDate,
      // Normalize start date field
      startDate: obj.startDate || obj.StartDate,
      // Normalize target quit date field
      targetQuitDate: obj.targetQuitDate || obj.TargetQuitDate,
      // Normalize personal motivation field
      personalMotivation: obj.personalMotivation || obj.PersonalMotivation
    };
  }
};

export default DateUtils;
