import api from '../api/axios';
import { DateUtils } from './dateUtils';

/**
 * API helper functions with consistent error handling and data normalization
 */
export const ApiHelper = {
  /**
   * Fetch progress logs with date normalization
   * @returns {Promise<Array>} - Normalized progress logs
   */
  fetchProgressLogs: async () => {
    try {
      const response = await api.get("/ProgressLog/GetProgress-logs");
      const logs = response.data || [];
      
      // Normalize date fields and sort by date
      return logs
        .map(log => DateUtils.normalizeFields(log))
        .sort((a, b) => new Date(a.date) - new Date(b.date));
    } catch (error) {
      console.error('❌ Error fetching progress logs:', error);
      throw new Error('Không thể lấy dữ liệu tiến trình');
    }
  },

  /**
   * Fetch current goal with field normalization
   * @returns {Promise<Object>} - Normalized current goal
   */
  fetchCurrentGoal: async () => {
    try {
      const response = await api.get("/CurrentGoal");
      return DateUtils.normalizeFields(response.data);
    } catch (error) {
      console.error('❌ Error fetching current goal:', error);
      throw new Error('Không thể lấy mục tiêu hiện tại');
    }
  },

  /**
   * Fetch goal plan with field normalization
   * @returns {Promise<Object>} - Normalized goal plan
   */
  fetchGoalPlan: async () => {
    try {
      const response = await api.get("/GoalPlan/current-goal");
      return DateUtils.normalizeFields(response.data);
    } catch (error) {
      console.error('❌ Error fetching goal plan:', error);
      return null; // Return null instead of throwing for optional data
    }
  },

  /**
   * Fetch weekly plans for a goal plan
   * @param {number} planId - Goal plan ID
   * @returns {Promise<Array>} - Weekly plans with normalized dates
   */
  fetchWeeklyPlans: async (planId) => {
    try {
      const response = await api.get(`/GoalPlanWeeklyReduction/plan/${planId}`);
      return (response.data || []).map(plan => ({
        ...plan,
        weekStartDate: DateUtils.toISODateString(plan.weekStartDate),
        weekEndDate: DateUtils.toISODateString(plan.weekEndDate)
      }));
    } catch (error) {
      console.error('❌ Error fetching weekly plans:', error);
      return [];
    }
  },

  /**
   * Create a new progress log
   * @param {Object} logData - Progress log data
   * @returns {Promise<Object>} - Created progress log
   */
  createProgressLog: async (logData) => {
    try {
      const normalizedData = {
        ...logData,
        logDate: DateUtils.toISODateString(logData.logDate || new Date())
      };
      
      const response = await api.post("/ProgressLog/CreateProgress-log", normalizedData);
      return DateUtils.normalizeFields(response.data);
    } catch (error) {
      console.error('❌ Error creating progress log:', error);
      throw new Error('Không thể tạo nhật ký tiến trình');
    }
  },

  /**
   * Create a new goal plan with proper date handling
   * @param {Object} planData - Goal plan data
   * @returns {Promise<Object>} - Created goal plan
   */
  createGoalPlan: async (planData) => {
    try {
      const normalizedData = {
        ...planData,
        startDate: DateUtils.toISODateString(planData.startDate),
        targetQuitDate: DateUtils.toISODateString(planData.targetQuitDate)
      };
      
      const response = await api.post('/GoalPlan', normalizedData);
      return DateUtils.normalizeFields(response.data);
    } catch (error) {
      console.error('❌ Error creating goal plan:', error);
      throw new Error('Không thể tạo kế hoạch mục tiêu');
    }
  },

  /**
   * Create weekly reduction plan
   * @param {Object} weeklyData - Weekly plan data
   * @returns {Promise<Object>} - Created weekly plan
   */
  createWeeklyPlan: async (weeklyData) => {
    try {
      const normalizedData = {
        ...weeklyData,
        weekStartDate: DateUtils.toISODateString(weeklyData.weekStartDate),
        weekEndDate: DateUtils.toISODateString(weeklyData.weekEndDate)
      };
      
      const response = await api.post('/GoalPlanWeeklyReduction', normalizedData);
      return response.data;
    } catch (error) {
      console.error('❌ Error creating weekly plan:', error);
      throw new Error('Không thể tạo kế hoạch tuần');
    }
  },

  /**
   * Fetch all dashboard data in one call with proper error handling
   * @returns {Promise<Object>} - All dashboard data
   */
  fetchAllDashboardData: async () => {
    const results = await Promise.allSettled([
      ApiHelper.fetchProgressLogs(),
      ApiHelper.fetchCurrentGoal(),
      ApiHelper.fetchGoalPlan()
    ]);

    const [progressLogsResult, currentGoalResult, goalPlanResult] = results;

    return {
      progressLogs: progressLogsResult.status === 'fulfilled' ? progressLogsResult.value : [],
      currentGoal: currentGoalResult.status === 'fulfilled' ? currentGoalResult.value : null,
      goalPlan: goalPlanResult.status === 'fulfilled' ? goalPlanResult.value : null,
      errors: results
        .filter(result => result.status === 'rejected')
        .map(result => result.reason?.message || 'Unknown error')
    };
  }
};

export default ApiHelper;
