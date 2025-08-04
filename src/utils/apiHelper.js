import api from "../api/axios";
import { DateUtils } from "./dateUtils";
import { TriggerFactorService } from "../api/triggerFactorService";

export const ApiHelper = {
  fetchProgressLogs: async () => {
    try {
      const response = await api.get("/ProgressLog/GetProgress-logs");
      const logs = response.data || [];

      return logs
        .map((log) => DateUtils.normalizeFields(log))
        .sort((a, b) => new Date(a.date) - new Date(b.date));
    } catch (error) {
      console.error("❌ Error fetching progress logs:", error);
      // Return empty array instead of throwing error to prevent blocking other functionality
      if (error.response?.status === 404) {
        console.warn("⚠️ Progress logs endpoint not found, returning empty array");
        return [];
      }
      throw new Error("Không thể lấy dữ liệu tiến trình");
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
      console.error("❌ Error fetching goal plan:", error);
      return null;
    }
  },

  fetchWeeklyPlans: async (planId) => {
    try {
      const response = await api.get(`/GoalPlanWeeklyReduction/plan/${planId}`);
      return (response.data || []).map((plan) => ({
        ...plan,
        weekStartDate: DateUtils.toISODateString(plan.weekStartDate),
        weekEndDate: DateUtils.toISODateString(plan.weekEndDate),
      }));
    } catch (error) {
      console.error("❌ Error fetching weekly plans:", error);
      return [];
    }
  },

  deleteGoalPlan: async (planId) => {
    try {
      await api.delete(`/GoalPlan/${planId}`);
    } catch (error) {
      console.error("❌ Error deleting goal plan:", error);
      throw new Error("Không thể xóa kế hoạch");
    }
  },

  createProgressLog: async (logData) => {
    try {
      const normalizedData = {
        ...logData,
        logDate: DateUtils.toISODateString(logData.logDate || new Date()),
      };

      const response = await api.post(
        "/ProgressLog/CreateProgress-log",
        normalizedData
      );
      return DateUtils.normalizeFields(response.data);
    } catch (error) {
      console.error("❌ Error creating progress log:", error);
      throw new Error("Không thể tạo nhật ký tiến trình");
    }
  },

  createGoalPlan: async (planData) => {
    try {
      const normalizedData = {
        ...planData,
        startDate: DateUtils.toISODateString(planData.startDate),
        endDate: DateUtils.toISODateString(planData.targetQuitDate),
      };

      const response = await api.post(
        "/GoalPlan/CreateGoalPlan",
        normalizedData
      );
      return DateUtils.normalizeFields(response.data);
    } catch (error) {
      console.error("❌ Error creating goal plan:", error);
      throw new Error("Không thể tạo kế hoạch mục tiêu");
    }
  },

  updateGoalPlan: async (planData) => {
    try {
      const normalizedData = {
        startDate: DateUtils.toISODateString(planData.startDate),
        endDate: DateUtils.toISODateString(planData.targetQuitDate),
        isCurrentGoal: planData.isCurrentGoal !== undefined ? planData.isCurrentGoal : true,
        updatedAt: new Date().toISOString(),
      };

      const response = await api.put(
        "/GoalPlan/UpdateMyGoalPlan",
        normalizedData
      );
      return DateUtils.normalizeFields(response.data);
    } catch (error) {
      console.error("❌ Error updating goal plan:", error);
      throw new Error("Không thể cập nhật kế hoạch mục tiêu");
    }
  },

  createWeeklyPlan: async (weeklyData) => {
    try {
      const normalizedData = {
        ...weeklyData,
        weekStartDate: DateUtils.toISODateString(weeklyData.weekStartDate),
        weekEndDate: DateUtils.toISODateString(weeklyData.weekEndDate),
      };

      const response = await api.post(
        "/GoalPlanWeeklyReduction",
        normalizedData
      );
      return response.data;
    } catch (error) {
      console.error("❌ Error creating weekly plan:", error);
      throw new Error("Không thể tạo kế hoạch tuần");
    }
  },

  fetchGeneratedWeeklySchedule: async () => {
    try {
      const response = await api.get(
        "/GoalPlanWeeklyReduction/generate-weekly-schedule"
      );
      return (response.data || []).map((week) => ({
        ...week,
        startDate: DateUtils.toISODateString(week.startDate),
        endDate: DateUtils.toISODateString(week.endDate),
      }));
    } catch (error) {
      console.error("❌ Error fetching generated weekly schedule:", error);
      return [];
    }
  },

  fetchCurrentGoal: async () => {
    try {
      const response = await api.get("/CurrentGoal");
      console.log("📊 CurrentGoal API Response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Error fetching current goal:", error);
      return null;
    }
  },

  fetchPlanHistory: async () => {
    try {
      const response = await api.get("/GoalPlan/GetAllGoalPlan"); // Đúng endpoint
      const plans = Array.isArray(response.data) ? response.data : [];
      return plans.map(plan => DateUtils.normalizeFields(plan));
    } catch (error) {
      console.error("❌ Error fetching plan history:", error);
      return [];
    }
  },

  fetchAllDashboardData: async () => {
    const results = await Promise.allSettled([
      ApiHelper.fetchProgressLogs(),
      ApiHelper.fetchGoalPlan(),
      ApiHelper.fetchCurrentGoal(),
    ]);

    const [progressLogsResult, goalPlanResult, currentGoalResult] = results;

    return {
      progressLogs:
        progressLogsResult.status === "fulfilled"
          ? progressLogsResult.value
          : [],
      currentGoal:
        currentGoalResult.status === "fulfilled"
          ? currentGoalResult.value
          : null,
      goalPlan:
        goalPlanResult.status === "fulfilled" ? goalPlanResult.value : null,
      errors: results
        .filter((result) => result.status === "rejected")
        .map((result) => {
          const error = result.reason;
          // More descriptive error messages
          if (error?.response?.status === 404) {
            return `API endpoint not found: ${error.config?.url || 'unknown'}`;
          }
          return error?.message || "Unknown error";
        }),
    };
  },

  // TriggerFactor API functions
  fetchAllTriggerFactors: async () => {
    try {
      return await TriggerFactorService.getAllTriggerFactors();
    } catch (error) {
      console.error("❌ Error fetching all trigger factors:", error);
      throw error;
    }
  },

  fetchMyTriggerFactors: async () => {
    try {
      return await TriggerFactorService.getMyTriggerFactors();
    } catch (error) {
      console.error("❌ Error fetching my trigger factors:", error);
      throw error;
    }
  },

  createTriggerFactor: async (name) => {
    try {
      return await TriggerFactorService.createTriggerFactor({ name });
    } catch (error) {
      console.error("❌ Error creating trigger factor:", error);
      throw error;
    }
  },

  createAndAssignTriggerFactor: async (name) => {
    try {
      return await TriggerFactorService.createAndAssignTriggerFactor(name);
    } catch (error) {
      console.error("❌ Error creating and assigning trigger factor:", error);
      throw error;
    }
  },

  // COACH SPECIFIC: Create and assign to specific member
  createAndAssignTriggerFactorToMember: async (name, memberId) => {
    try {
      return await TriggerFactorService.createAndAssignToMember(name, memberId);
    } catch (error) {
      console.error("❌ Error creating and assigning trigger factor to member:", error);
      throw error;
    }
  },

  // COACH SPECIFIC: Get member's trigger factors
  getMemberTriggerFactors: async (memberId) => {
    try {
      return await TriggerFactorService.getMemberTriggerFactors(memberId);
    } catch (error) {
      console.error("❌ Error fetching member trigger factors:", error);
      throw error;
    }
  },

  // COACH SPECIFIC: Assign existing triggers to member
  assignTriggerFactorsToMember: async (memberId, triggerIds) => {
    try {
      return await TriggerFactorService.assignTriggerFactorsToMember(memberId, triggerIds);
    } catch (error) {
      console.error("❌ Error assigning trigger factors to member:", error);
      throw error;
    }
  },

  updateTriggerFactor: async (id, updateData) => {
    try {
      return await TriggerFactorService.updateTriggerFactor(id, updateData);
    } catch (error) {
      console.error("❌ Error updating trigger factor:", error);
      throw error;
    }
  },

  removeTriggerFactorFromMember: async (triggerId) => {
    try {
      return await TriggerFactorService.removeTriggerFactorFromMember(triggerId);
    } catch (error) {
      console.error("❌ Error removing trigger factor from member:", error);
      throw error;
    }
  },

  assignTriggerFactorsToCurrentUser: async (triggerIds) => {
    try {
      return await TriggerFactorService.assignTriggerFactorsToCurrentUser(triggerIds);
    } catch (error) {
      console.error("❌ Error assigning trigger factors to current user:", error);
      throw error;
    }
  },

  deleteTriggerFactor: async (id) => {
    try {
      return await TriggerFactorService.deleteTriggerFactor(id);
    } catch (error) {
      console.error("❌ Error deleting trigger factor:", error);
      throw error;
    }
  },
};

export default ApiHelper;
