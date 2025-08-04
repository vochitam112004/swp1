import api from '../api/axios';
import { DateUtils } from './dateUtils';

export const ApiHelper = {
  fetchProgressLogs: async () => {
    try {
      const response = await api.get("/ProgressLog/GetProgress-logs");
      const logs = response.data || [];

      return logs
        .map(log => DateUtils.normalizeFields(log))
        .sort((a, b) => new Date(a.date) - new Date(b.date));
    } catch (error) {
      console.error('❌ Error fetching progress logs:', error);
      throw new Error('Không thể lấy dữ liệu tiến trình');
    }
  },

  fetchGoalPlan: async () => {
    try {
      const response = await api.get("/GoalPlan/GetMyCurrentGoalPlans");
      const data = response.data;
      if (Array.isArray(data) && data.length > 0) {
        return DateUtils.normalizeFields(data[0]);
      }
      return null;
    } catch (error) {
      console.error('❌ Error fetching goal plan:', error);
      return null;
    }
  },

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

  deleteGoalPlan: async (planId) => {
    try {
      const response = await api.delete(`/GoalPlan/${planId}`);
      return response.data;
    } catch (error) {
      console.error("❌ Error deleting goal plan:", error);
      throw new Error("Không thể xóa kế hoạch");
    }
  },


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

  createGoalPlan: async (planData) => {
    try {
      const normalizedData = {
        ...planData,
        startDate: DateUtils.toISODateString(planData.startDate),
        endDate: DateUtils.toISODateString(planData.targetQuitDate)
      };

      const response = await api.post('/GoalPlan/CreateGoalPlan', normalizedData);
      return DateUtils.normalizeFields(response.data);
    } catch (error) {
      console.error('❌ Error creating goal plan:', error);
      throw new Error('Không thể tạo kế hoạch mục tiêu');
    }
  },

  updateGoalPlan: async (planData) => {
    try {
      const normalizedData = {
        startDate: DateUtils.toISODateString(planData.startDate),
        endDate: DateUtils.toISODateString(planData.targetQuitDate),
        isCurrentGoal: planData.isCurrentGoal || true,
        updatedAt: new Date().toISOString()
      };

      const response = await api.put('/GoalPlan/UpdateMyGoalPlan', normalizedData);
      return DateUtils.normalizeFields(response.data);
    } catch (error) {
      console.error('❌ Error updating goal plan:', error);
      throw new Error('Không thể cập nhật kế hoạch mục tiêu');
    }
  },

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

  fetchAllDashboardData: async () => {
    const results = await Promise.allSettled([
      ApiHelper.fetchProgressLogs(),
      ApiHelper.fetchGoalPlan()
    ]);

    const [progressLogsResult, goalPlanResult] = results;

    return {
      progressLogs: progressLogsResult.status === 'fulfilled' ? progressLogsResult.value : [],
      currentGoal: null,
      goalPlan: goalPlanResult.status === 'fulfilled' ? goalPlanResult.value : null,
      errors: results
        .filter(result => result.status === 'rejected')
        .map(result => result.reason?.message || 'Unknown error')
    };
  }
};

export default ApiHelper;
