import api from "./axios";

/**
 * MemberProfile API Service
 * Based on Swagger API specification
 */
export const MemberProfileService = {
  /**
   * GET /api/MemberProfile/GetMemberProfileByUserId/{userId}
   * Get member profile by user ID
   * @param {number} userId - User ID
   */
  getMemberProfileByUserId: async (userId) => {
    try {
      const response = await api.get(`/MemberProfile/GetMemberProfileByUserId/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching member profile by user ID:', error);
      throw new Error(error.response?.data?.message || 'Không thể lấy thông tin hồ sơ thành viên');
    }
  },

  /**
   * GET /api/MemberProfile/GetMyMemberProfile
   * Get current user's member profile
   */
  getMyMemberProfile: async () => {
    try {
      const response = await api.get('/MemberProfile/GetMyMemberProfile');
      return response.data;
    } catch (error) {
      console.error('Error fetching my member profile:', error);
      
      // If no profile exists, return null instead of throwing error
      if (error.response?.status === 404) {
        return null;
      }
      
      throw new Error(error.response?.data?.message || 'Không thể lấy thông tin hồ sơ của bạn');
    }
  },

  /**
   * POST /api/MemberProfile/CreateMyMemberProfile
   * Create member profile for current user
   * @param {Object} profileData - Member profile data
   */
  createMyMemberProfile: async (profileData) => {
    try {
      const payload = {
        cigarettesSmoked: profileData.cigarettesSmoked || 0,
        quitAttempts: profileData.quitAttempts || 0,
        experienceLevel: profileData.experienceLevel || 0,
        personalMotivation: profileData.personalMotivation || "",
        health: profileData.health || "",
        pricePerPack: profileData.pricePerPack || 0,
        cigarettesPerPack: profileData.cigarettesPerPack || 20,
        create: new Date().toISOString()
      };

      const response = await api.post('/MemberProfile/CreateMyMemberProfile', payload);
      return response.data;
    } catch (error) {
      console.error('Error creating member profile:', error);
      throw new Error(error.response?.data?.message || 'Không thể tạo hồ sơ thành viên');
    }
  },

  /**
   * PUT /api/MemberProfile/UpdateMyMemberProfile
   * Update current user's member profile
   * @param {Object} profileData - Updated member profile data
   */
  updateMyMemberProfile: async (profileData) => {
    try {
      const payload = {
        cigarettesSmoked: profileData.cigarettesSmoked,
        quitAttempts: profileData.quitAttempts,
        experienceLevel: profileData.experienceLevel,
        personalMotivation: profileData.personalMotivation,
        health: profileData.health,
        pricePerPack: profileData.pricePerPack,
        cigarettesPerPack: profileData.cigarettesPerPack,
        updatedAt: new Date().toISOString()
      };

      const response = await api.put('/MemberProfile/UpdateMyMemberProfile', payload);
      return response.data;
    } catch (error) {
      console.error('Error updating member profile:', error);
      throw new Error(error.response?.data?.message || 'Không thể cập nhật hồ sơ thành viên');
    }
  },

  /**
   * DELETE /api/MemberProfile/DeleteMyMemberProfile
   * Delete current user's member profile
   */
  deleteMyMemberProfile: async () => {
    try {
      const response = await api.delete('/MemberProfile/DeleteMyMemberProfile');
      return response.data;
    } catch (error) {
      console.error('Error deleting member profile:', error);
      throw new Error(error.response?.data?.message || 'Không thể xóa hồ sơ thành viên');
    }
  },

  /**
   * Helper function to get or create member profile
   * If profile doesn't exist, create a default one
   */
  getOrCreateMemberProfile: async () => {
    try {
      // Try to get existing profile
      const existingProfile = await MemberProfileService.getMyMemberProfile();
      
      if (existingProfile) {
        return existingProfile;
      }

      // If no profile exists, create a default one
      const defaultProfile = {
        cigarettesSmoked: 0,
        quitAttempts: 0,
        experienceLevel: 1,
        personalMotivation: "",
        health: "",
        pricePerPack: 50000,
        cigarettesPerPack: 20
      };

      return await MemberProfileService.createMyMemberProfile(defaultProfile);
    } catch (error) {
      console.error('Error getting or creating member profile:', error);
      throw error;
    }
  },

  /**
   * Helper function to update specific fields of member profile
   * @param {Object} updates - Object containing fields to update
   */
  updateMemberProfileFields: async (updates) => {
    try {
      // First get current profile
      let currentProfile = await MemberProfileService.getMyMemberProfile();
      
      // If no profile exists, create one with the updates
      if (!currentProfile) {
        return await MemberProfileService.createMyMemberProfile(updates);
      }

      // Merge updates with current profile
      const updatedProfile = {
        cigarettesSmoked: updates.cigarettesSmoked !== undefined ? updates.cigarettesSmoked : currentProfile.cigarettesSmoked,
        quitAttempts: updates.quitAttempts !== undefined ? updates.quitAttempts : currentProfile.quitAttempts,
        experienceLevel: updates.experienceLevel !== undefined ? updates.experienceLevel : currentProfile.experienceLevel,
        personalMotivation: updates.personalMotivation !== undefined ? updates.personalMotivation : currentProfile.personalMotivation,
        health: updates.health !== undefined ? updates.health : currentProfile.health,
        pricePerPack: updates.pricePerPack !== undefined ? updates.pricePerPack : currentProfile.pricePerPack,
        cigarettesPerPack: updates.cigarettesPerPack !== undefined ? updates.cigarettesPerPack : currentProfile.cigarettesPerPack
      };

      return await MemberProfileService.updateMyMemberProfile(updatedProfile);
    } catch (error) {
      console.error('Error updating member profile fields:', error);
      throw error;
    }
  }
};

export default MemberProfileService;
