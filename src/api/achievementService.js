import api from './axios';

/**
 * Achievement Service - Handles all achievement-related API calls
 * Based on backend API specification for AchievementTemplate and UserAchievement
 */
export const achievementService = {
  // =================== ACHIEVEMENT TEMPLATE APIS ===================
  
  /**
   * GET /api/AchievementTemplate
   * Get all achievement templates
   * @returns {Promise} Promise containing all achievement templates
   */
  getAllTemplates: async () => {
    try {
      const response = await api.get('/AchievementTemplate');
      return {
        success: true,
        data: response.data,
        templates: Array.isArray(response.data) ? response.data : []
      };
    } catch (error) {
      console.error('Error fetching achievement templates:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
        templates: []
      };
    }
  },

  /**
   * POST /api/AchievementTemplate
   * Create a new achievement template
   * @param {Object} templateData - Template data
   * @param {string} templateData.name - Template name
   * @param {number} templateData.requiredSmokeFreeDays - Required smoke-free days
   * @param {string} templateData.description - Template description
   * @returns {Promise} Promise containing created template
   */
  createTemplate: async (templateData) => {
    try {
      const response = await api.post('/AchievementTemplate', {
        name: templateData.name,
        requiredSmokeFreeDays: templateData.requiredSmokeFreeDays,
        description: templateData.description
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error creating achievement template:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  },

  /**
   * PUT /api/AchievementTemplate/{id}
   * Update an achievement template
   * @param {number} templateId - Template ID to update
   * @param {Object} templateData - Updated template data
   * @param {string} templateData.name - Template name
   * @param {number} templateData.requiredSmokeFreeDays - Required smoke-free days
   * @param {string} templateData.description - Template description
   * @returns {Promise} Promise containing updated template
   */
  updateTemplate: async (templateId, templateData) => {
    try {
      const response = await api.put(`/AchievementTemplate/${templateId}`, {
        name: templateData.name,
        requiredSmokeFreeDays: templateData.requiredSmokeFreeDays,
        description: templateData.description
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error updating achievement template:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  },

  /**
   * DELETE /api/AchievementTemplate/{id}
   * Delete an achievement template
   * @param {number} templateId - Template ID to delete
   * @returns {Promise} Promise containing deletion result
   */
  deleteTemplate: async (templateId) => {
    try {
      await api.delete(`/AchievementTemplate/${templateId}`);
      return {
        success: true
      };
    } catch (error) {
      console.error('Error deleting achievement template:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  },

  // =================== USER ACHIEVEMENT APIS ===================

  /**
   * GET /api/UserAchievement/{userId}
   * Get all achievements for a specific user
   * @param {number} userId - User ID to get achievements for
   * @returns {Promise} Promise containing user achievements
   */
  getUserAchievements: async (userId) => {
    try {
      const response = await api.get(`/UserAchievement/${userId}`);
      return {
        success: true,
        data: response.data,
        achievements: Array.isArray(response.data) ? response.data : []
      };
    } catch (error) {
      console.error('Error fetching user achievements:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message,
        achievements: []
      };
    }
  },

  /**
   * POST /api/UserAchievement/assign
   * Assign an achievement template to a user
   * @param {Object} assignmentData - Assignment data
   * @param {number} assignmentData.userId - User ID
   * @param {number} assignmentData.templateId - Template ID to assign
   * @returns {Promise} Promise containing assignment result
   */
  assignAchievement: async (assignmentData) => {
    try {
      const response = await api.post('/UserAchievement/assign', {
        userId: assignmentData.userId,
        templateId: assignmentData.templateId
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error assigning achievement:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  },

  /**
   * DELETE /api/UserAchievement/{userId}/{templateId}
   * Remove an achievement assignment from a user
   * @param {number} userId - User ID
   * @param {number} templateId - Template ID to remove
   * @returns {Promise} Promise containing removal result
   */
  removeUserAchievement: async (userId, templateId) => {
    try {
      await api.delete(`/UserAchievement/${userId}/${templateId}`);
      return {
        success: true
      };
    } catch (error) {
      console.error('Error removing user achievement:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  },

  // =================== HELPER FUNCTIONS ===================

  /**
   * Get achievements for current logged-in user
   * @returns {Promise} Promise containing current user's achievements
   */
  getMyAchievements: async () => {
    try {
      // Get current user info first (assuming there's a way to get current user ID)
      // For now, we'll need to get this from context or separate API call
      // This is a helper function that might need user context
      throw new Error('Current user ID required. Use getUserAchievements(userId) instead.');
    } catch (error) {
      console.error('Error getting my achievements:', error);
      return {
        success: false,
        error: 'Current user ID required. Use getUserAchievements(userId) instead.',
        achievements: []
      };
    }
  },

  /**
   * Check if user qualifies for specific achievement templates based on smoke-free days
   * @param {number} smokeFreeDays - Number of smoke-free days
   * @param {Array} templates - Array of achievement templates
   * @returns {Array} Array of qualifying templates
   */
  getQualifyingTemplates: (smokeFreeDays, templates = []) => {
    return templates.filter(template => 
      smokeFreeDays >= template.requiredSmokeFreeDays
    ).sort((a, b) => b.requiredSmokeFreeDays - a.requiredSmokeFreeDays);
  },

  /**
   * Calculate achievement progress for a user
   * @param {number} smokeFreeDays - Current smoke-free days
   * @param {Array} templates - Available templates
   * @param {Array} userAchievements - User's current achievements
   * @returns {Object} Progress information
   */
  calculateProgress: (smokeFreeDays, templates = [], userAchievements = []) => {
    const completed = userAchievements.length;
    const qualifying = achievementService.getQualifyingTemplates(smokeFreeDays, templates);
    const nextTemplate = templates
      .filter(t => t.requiredSmokeFreeDays > smokeFreeDays)
      .sort((a, b) => a.requiredSmokeFreeDays - b.requiredSmokeFreeDays)[0];

    return {
      completed,
      total: templates.length,
      qualifying: qualifying.length,
      nextAchievement: nextTemplate,
      daysUntilNext: nextTemplate ? nextTemplate.requiredSmokeFreeDays - smokeFreeDays : 0,
      progressPercentage: templates.length > 0 ? (completed / templates.length) * 100 : 0
    };
  }
};

export default achievementService;
