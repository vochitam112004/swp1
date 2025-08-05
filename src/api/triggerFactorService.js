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
   * GET member's trigger factors (for coaches)
   * Try multiple possible endpoints since Swagger doesn't specify this
   * @param {number} memberId - Member ID
   */
  getMemberTriggerFactors: async (memberId) => {
    try {
      console.log(`🔄 Trying to fetch triggers for memberId: ${memberId}`);
      
      // Try different possible endpoints
      let response;
      let endpointUsed = '';
      
      try {
        // Option 1: Try a coach-specific endpoint
        endpointUsed = `/TriggerFactor/GetMemberTriggerFactors/${memberId}`;
        response = await api.get(endpointUsed);
        console.log(`✅ Success with endpoint: ${endpointUsed}`);
      } catch (error1) {
        try {
          // Option 2: Try with query parameter
          endpointUsed = `/TriggerFactor/Get-MyTriggerFactor?memberId=${memberId}`;
          response = await api.get(endpointUsed);
          console.log(`✅ Success with endpoint: ${endpointUsed}`);
        } catch (error2) {
          try {
            // Option 3: Try a different pattern
            endpointUsed = `/TriggerFactor/GetByMember/${memberId}`;
            response = await api.get(endpointUsed);
            console.log(`✅ Success with endpoint: ${endpointUsed}`);
          } catch (error3) {
            try {
              // Option 4: Try coach endpoint with member parameter
              endpointUsed = `/TriggerFactor/GetMemberTriggers?memberId=${memberId}`;
              response = await api.get(endpointUsed);
              console.log(`✅ Success with endpoint: ${endpointUsed}`);
            } catch (error4) {
              console.warn(`⚠️ All endpoints failed for memberId ${memberId}. Available endpoints might be different.`);
              console.warn('Tried:', [
                `/TriggerFactor/GetMemberTriggerFactors/${memberId}`,
                `/TriggerFactor/Get-MyTriggerFactor?memberId=${memberId}`,
                `/TriggerFactor/GetByMember/${memberId}`,
                `/TriggerFactor/GetMemberTriggers?memberId=${memberId}`
              ]);
              
              // Return empty array instead of crashing
              return [];
            }
          }
        }
      }
      
      const triggers = response.data || [];
      console.log(`✅ Found ${triggers.length} triggers for member ${memberId} using ${endpointUsed}`);
      return triggers;
    } catch (error) {
      console.error(`❌ Error fetching member trigger factors for memberId ${memberId}:`, error);
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
      throw new Error(error.response?.data?.message || 'Không thể gán yếu tố kích thích cho thành viên');
    }
  },

  /**
   * Assign trigger factors to current user
   * Since there's no endpoint without memberId, we need to get current user's memberId first
   * @param {number[]} triggerIds - Array of trigger factor IDs
   */
  assignTriggerFactorsToCurrentUser: async (triggerIds) => {
    try {
      // We need to get the current user's member profile to get memberId
      // Import MemberProfileService to get current user's memberId
      const { MemberProfileService } = await import('./memberProfileService.js');
      const memberProfile = await MemberProfileService.getMyMemberProfile();
      
      if (!memberProfile?.memberId) {
        throw new Error('Không tìm thấy hồ sơ thành viên. Vui lòng tạo hồ sơ trước.');
      }

      return await TriggerFactorService.assignTriggerFactorsToMember(memberProfile.memberId, triggerIds);
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
