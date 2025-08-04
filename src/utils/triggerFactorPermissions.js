/**
 * Role-based access control utilities for TriggerFactor
 */

// User roles
export const USER_ROLES = {
  COACH: 'Coach',
  MEMBER: 'Member',
  ADMIN: 'Admin'
};

// TriggerFactor permissions
export const TRIGGER_PERMISSIONS = {
  // Coach permissions
  [USER_ROLES.COACH]: {
    canViewAll: true,
    canViewMy: true,
    canCreate: true,
    canUpdate: true,
    canDelete: true,
    canAssign: true,
    canRemoveFromMember: true,
    canManageForMembers: true
  },
  
  // Member permissions  
  [USER_ROLES.MEMBER]: {
    canViewAll: false,
    canViewMy: true,
    canCreate: false,
    canUpdate: false,
    canDelete: false,
    canAssign: false,
    canRemoveFromMember: true, // Only remove from their own list
    canManageForMembers: false
  },

  // Admin permissions (full access)
  [USER_ROLES.ADMIN]: {
    canViewAll: true,
    canViewMy: true,
    canCreate: true,
    canUpdate: true,
    canDelete: true,
    canAssign: true,
    canRemoveFromMember: true,
    canManageForMembers: true
  }
};

/**
 * Get user role from user object
 * @param {Object} user - User object from AuthContext
 * @returns {string} - User role
 */
export const getUserRole = (user) => {
  return user?.userType || null;
};

/**
 * Check if user has specific permission for TriggerFactor
 * @param {Object} user - User object from AuthContext
 * @param {string} permission - Permission to check
 * @returns {boolean} - Whether user has permission
 */
export const hasPermission = (user, permission) => {
  const role = getUserRole(user);
  if (!role || !TRIGGER_PERMISSIONS[role]) {
    return false;
  }
  
  return TRIGGER_PERMISSIONS[role][permission] === true;
};

/**
 * Get all permissions for user role
 * @param {Object} user - User object from AuthContext
 * @returns {Object} - Permissions object
 */
export const getUserPermissions = (user) => {
  const role = getUserRole(user);
  return TRIGGER_PERMISSIONS[role] || {};
};

/**
 * Check if user is coach
 * @param {Object} user - User object from AuthContext
 * @returns {boolean}
 */
export const isCoach = (user) => {
  return getUserRole(user) === USER_ROLES.COACH;
};

/**
 * Check if user is member
 * @param {Object} user - User object from AuthContext
 * @returns {boolean}
 */
export const isMember = (user) => {
  return getUserRole(user) === USER_ROLES.MEMBER;
};

/**
 * Check if user is admin
 * @param {Object} user - User object from AuthContext
 * @returns {boolean}
 */
export const isAdmin = (user) => {
  return getUserRole(user) === USER_ROLES.ADMIN;
};

/**
 * Filter available actions for TriggerFactor based on user role
 * @param {Object} user - User object from AuthContext
 * @returns {Object} - Available actions
 */
export const getAvailableActions = (user) => {
  const permissions = getUserPermissions(user);
  const role = getUserRole(user);
  
  return {
    // UI Display
    showAllTriggers: permissions.canViewAll,
    showCreateButton: permissions.canCreate,
    showManageForMembers: permissions.canManageForMembers,
    
    // Actions
    canCreateTrigger: permissions.canCreate,
    canUpdateTrigger: permissions.canUpdate,
    canDeleteTrigger: permissions.canDelete,
    canAssignToUsers: permissions.canAssign && role === USER_ROLES.COACH,
    canRemoveFromSelf: permissions.canRemoveFromMember,
    canRemoveFromMembers: permissions.canRemoveFromMember && role === USER_ROLES.COACH,
    
    // Role info
    userRole: role,
    isCoach: isCoach(user),
    isMember: isMember(user),
    isAdmin: isAdmin(user)
  };
};
