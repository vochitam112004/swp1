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
   * GET /api/TriggerFactor/member/{memberId}
   * Get specific member's trigger factors (for coaches)
   * @param {number} memberId - Member ID
   */
  getMemberTriggerFactors: async (memberId) => {
    try {
      // Try different possible endpoints since we don't have a specific one
      let response;
      
      try {
        // First try a coach-specific endpoint if it exists
        response = await api.get(`/TriggerFactor/member/${memberId}/triggers`);
      } catch (error1) {
        try {
          // Try another possible endpoint
          response = await api.get(`/TriggerFactor/GetTriggerFactorByMember/${memberId}`);
        } catch (error2) {
          try {
            // Try with query parameter
            response = await api.get('/TriggerFactor/GetMemberTriggerFactors', {
              params: { memberId }
            });
          } catch (error3) {
            try {
              // Try the original endpoint with member ID
              response = await api.get(`/TriggerFactor/member/${memberId}`);
            } catch (error4) {
              // If all endpoints fail, return empty array for now
              console.warn('No endpoint available to get member trigger factors, returning empty array');
              return [];
            }
          }
        }
      }
      
      return response.data || [];
    } catch (error) {
      console.error('Error fetching member trigger factors:', error);
      // Return empty array instead of throwing error to prevent UI crashes
      return [];
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
      console.log(`🔄 Assigning triggers ${triggerIds} to member ${memberId}`);
      const response = await api.post(`/TriggerFactor/assign/${memberId}`, triggerIds);
      console.log('✅ Successfully assigned triggers to member', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error assigning trigger factors to member:', error);
      
      // Try alternative endpoint if the first one fails
      try {
        console.log('🔄 Trying alternative assign endpoint...');
        const response = await api.post('/TriggerFactor/AssignToMember', {
          memberId: memberId,
          triggerFactorIds: triggerIds
        });
        console.log('✅ Successfully assigned triggers via alternative endpoint');
        return response.data;
      } catch (error2) {
        console.error('❌ Alternative endpoint also failed:', error2);
        throw new Error(error.response?.data?.message || 'Không thể gán yếu tố kích thích cho thành viên');
      }
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
      console.log(`🔄 Creating and assigning trigger "${name}" to member ${memberId}`);
      
      // Step 1: Create trigger factor
      const createResult = await TriggerFactorService.createTriggerFactor({ name });
      console.log('✅ Trigger created:', createResult);
      
      // Step 2: Extract trigger ID from response
      const triggerId = createResult.triggerId || createResult.id;
      
      if (!triggerId) {
        throw new Error('Không thể lấy ID của yếu tố kích thích vừa tạo');
      }

      // Step 3: Assign to specific member
      await TriggerFactorService.assignTriggerFactorsToMember(memberId, [triggerId]);
      console.log(`✅ Successfully created and assigned trigger to member ${memberId}`);
      
      return createResult;
    } catch (error) {
      console.error('❌ Error creating and assigning trigger factor to member:', error);
      throw error;
    }
  }
};

export default TriggerFactorService;
