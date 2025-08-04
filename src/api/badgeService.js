import api from './axios';

/**
 * Badge Service - Handles all badge-related API calls
 */
export const badgeService = {
  /**
   * Get current user's badges
   * @returns {Promise} Promise containing user's badge data
   */
  getMyBadges: async () => {
    try {
      const response = await api.get('/Badge/get-my-badges');
      return {
        success: true,
        data: response.data,
        badges: response.data?.badges || []
      };
    } catch (error) {
      console.error('Error fetching my badges:', error);
      return {
        success: false,
        error: error.message,
        badges: []
      };
    }
  },

  /**
   * Get badges by member ID (for coaches/admins)
   * @param {number} memberId - The member ID to get badges for
   * @returns {Promise} Promise containing member's badge data
   */
  getBadgesByMemberId: async (memberId) => {
    try {
      // Note: This endpoint might need to be updated based on new API structure
      const response = await api.get(`/Badge/GetByMemberId/${memberId}`);
      return {
        success: true,
        data: response.data,
        badges: Array.isArray(response.data) ? response.data : []
      };
    } catch (error) {
      console.error('Error fetching badges by member ID:', error);
      return {
        success: false,
        error: error.message,
        badges: []
      };
    }
  },

  /**
   * Get all available badges (for admin)
   * @returns {Promise} Promise containing all badges
   */
  getAllBadges: async () => {
    try {
      const response = await api.get('/Badge/GetAllBadge');
      return {
        success: true,
        data: response.data,
        badges: Array.isArray(response.data) ? response.data : []
      };
    } catch (error) {
      console.error('Error fetching all badges:', error);
      return {
        success: false,
        error: error.message,
        badges: []
      };
    }
  },

  /**
   * Create a new badge (admin only)
   * @param {FormData} formData - Badge data including image
   * @returns {Promise} Promise containing created badge
   */
  createBadge: async (formData) => {
    try {
      const response = await api.post('/Badge/Create-Badge', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error creating badge:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * Update a badge (admin only)
   * @param {number} badgeId - Badge ID to update
   * @param {FormData} formData - Updated badge data
   * @returns {Promise} Promise containing updated badge
   */
  updateBadge: async (badgeId, formData) => {
    try {
      const response = await api.put(`/Badge/Update-BadgeByBadgeId/${badgeId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Error updating badge:', error);
      return {
        success: false,
        error: error.message
      };
    }
  },

  /**
   * Delete a badge (admin only)
   * @param {number} badgeId - Badge ID to delete
   * @returns {Promise} Promise containing deletion result
   */
  deleteBadge: async (badgeId) => {
    try {
      await api.delete(`/Badge/Delete-BadgeByBadgeId/${badgeId}`);
      return {
        success: true
      };
    } catch (error) {
      console.error('Error deleting badge:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
};

export default badgeService;
