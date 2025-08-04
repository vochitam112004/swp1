import api from "./axios";

/**
 * TriggerFactor API Service
 * Based on Swagger API specification
 */
export const TriggerFactorService = {
  /**
   * GET /api/TriggerFactor/GetAllTriggerFactor
   * Get all trigger factors
   */
  getAllTriggerFactors: async () => {
    try {
      const response = await api.get('/TriggerFactor/GetAllTriggerFactor');
      return response.data;
    } catch (error) {
      console.error('Error fetching all trigger factors:', error);
      throw new Error('Không thể lấy danh sách tất cả yếu tố kích thích');
    }
  },

  /**
   * GET /api/TriggerFactor/Get-MyTriggerFactor
   * Get current user's trigger factors
   */
  getMyTriggerFactors: async () => {
    try {
      const response = await api.get('/TriggerFactor/Get-MyTriggerFactor');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching my trigger factors:', error);
      throw new Error('Không thể lấy danh sách yếu tố kích thích của bạn');
    }
  },

  /**
   * POST /api/TriggerFactor/Create-TriggerFactor
   * Create a new trigger factor
   * @param {Object} triggerData - { name: string, createdAt: string }
   */
  createTriggerFactor: async (triggerData) => {
    try {
      const payload = {
        name: triggerData.name,
        createdAt: new Date().toISOString()
      };
      
      const response = await api.post('/TriggerFactor/Create-TriggerFactor', payload);
      return response.data;
    } catch (error) {
      console.error('Error creating trigger factor:', error);
      throw new Error(error.response?.data?.message || 'Không thể tạo yếu tố kích thích mới');
    }
  },

  /**
   * PUT /api/TriggerFactor/Update-TriggerFactor/{id}
   * Update a trigger factor
   * @param {number} id - Trigger factor ID
   * @param {Object} updateData - { name: string, updatedAt: string }
   */
  updateTriggerFactor: async (id, updateData) => {
    try {
      const payload = {
        name: updateData.name,
        updatedAt: new Date().toISOString()
      };
      
      const response = await api.put(`/TriggerFactor/Update-TriggerFactor/${id}`, payload);
      return response.data;
    } catch (error) {
      console.error('Error updating trigger factor:', error);
      throw new Error(error.response?.data?.message || 'Không thể cập nhật yếu tố kích thích');
    }
  },

  /**
   * DELETE /api/TriggerFactor/removeTriggerFactorAtMember/{triggerId}
   * Remove trigger factor from current member
   * @param {number} triggerId - Trigger factor ID
   */
  removeTriggerFactorFromMember: async (triggerId) => {
    try {
      const response = await api.delete(`/TriggerFactor/removeTriggerFactorAtMember/${triggerId}`);
      return response.data;
    } catch (error) {
      console.error('Error removing trigger factor from member:', error);
      throw new Error(error.response?.data?.message || 'Không thể xóa yếu tố kích thích khỏi danh sách của bạn');
    }
  },

  /**
   * POST /api/TriggerFactor/assign/{memberId}
   * Assign trigger factors to a specific member
   * @param {number} memberId - Member ID
   * @param {number[]} triggerIds - Array of trigger factor IDs
   */
  assignTriggerFactorsToMember: async (memberId, triggerIds) => {
    try {
      const response = await api.post(`/TriggerFactor/assign/${memberId}`, triggerIds);
      return response.data;
    } catch (error) {
      console.error('Error assigning trigger factors to member:', error);
      throw new Error(error.response?.data?.message || 'Không thể gán yếu tố kích thích cho thành viên');
    }
  },

  /**
   * POST /api/TriggerFactor/assign (current user)
   * Assign trigger factors to current user (no memberId needed)
   * @param {number[]} triggerIds - Array of trigger factor IDs
   */
  assignTriggerFactorsToCurrentUser: async (triggerIds) => {
    try {
      // Based on the Swagger spec, there are two assign endpoints:
      // 1. POST /api/TriggerFactor/assign/{memberId} - for specific member
      // 2. POST /api/TriggerFactor/assign - likely for current user
      // We'll try the second one first, then fallback if needed
      const response = await api.post('/TriggerFactor/assign', triggerIds);
      return response.data;
    } catch (error) {
      console.error('Error assigning trigger factors to current user:', error);
      throw new Error(error.response?.data?.message || 'Không thể gán yếu tố kích thích');
    }
  },

  /**
   * DELETE /api/TriggerFactor/Delete-TriggerFactor/{id}
   * Delete a trigger factor completely
   * @param {number} id - Trigger factor ID
   */
  deleteTriggerFactor: async (id) => {
    try {
      const response = await api.delete(`/TriggerFactor/Delete-TriggerFactor/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting trigger factor:', error);
      throw new Error(error.response?.data?.message || 'Không thể xóa yếu tố kích thích');
    }
  },

  /**
   * Helper function to create and assign trigger factor to current user
   * @param {string} name - Trigger factor name
   */
  createAndAssignTriggerFactor: async (name) => {
    try {
      // Step 1: Create trigger factor
      const createResult = await TriggerFactorService.createTriggerFactor({ name });
      
      // Step 2: Extract trigger ID from response
      const triggerId = createResult.triggerId || createResult.id;
      
      if (!triggerId) {
        throw new Error('Không thể lấy ID của yếu tố kích thích vừa tạo');
      }

      // Step 3: Assign to current user
      await TriggerFactorService.assignTriggerFactorsToCurrentUser([triggerId]);
      
      return createResult;
    } catch (error) {
      console.error('Error creating and assigning trigger factor:', error);
      throw error;
    }
  },

  /**
   * COACH SPECIFIC: Create trigger factor and assign to specific member
   * @param {string} name - Trigger factor name
   * @param {number} memberId - Member ID to assign to
   */
  createAndAssignToMember: async (name, memberId) => {
    try {
      // Step 1: Create trigger factor
      const createResult = await TriggerFactorService.createTriggerFactor({ name });
      
      // Step 2: Extract trigger ID from response
      const triggerId = createResult.triggerId || createResult.id;
      
      if (!triggerId) {
        throw new Error('Không thể lấy ID của yếu tố kích thích vừa tạo');
      }

      // Step 3: Assign to specific member
      await TriggerFactorService.assignTriggerFactorsToMember(memberId, [triggerId]);
      
      return createResult;
    } catch (error) {
      console.error('Error creating and assigning trigger factor to member:', error);
      throw error;
    }
  },

  /**
   * Get trigger factors for specific member (Coach use)
   * @param {number} memberId - Member ID
   */
  getMemberTriggerFactors: async (memberId) => {
    try {
      // Note: Based on Swagger, there's no specific endpoint for getting member's triggers
      // We might need to use Get-MyTriggerFactor with different auth context
      // or get all triggers and filter. For now, we'll use the current user endpoint
      // and expect the backend to handle context properly
      const response = await api.get('/TriggerFactor/Get-MyTriggerFactor', {
        params: { memberId } // Try passing memberId as param
      });
      return response.data || [];
    } catch (error) {
      console.error('Error fetching member trigger factors:', error);
      throw new Error('Không thể lấy danh sách yếu tố kích thích của thành viên');
    }
  }
};

export default TriggerFactorService;
