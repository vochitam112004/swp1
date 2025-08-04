// Test file to verify useDashboardData hook fixes
import { renderHook } from '@testing-library/react';
import { useDashboardData } from './useDashboardData';

// Mock dependencies
jest.mock('../../auth/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 1 },
    loading: false
  })
}));

jest.mock('../../../api/axios', () => ({
  get: jest.fn()
}));

jest.mock('../../../utils/apiHelper', () => ({
  ApiHelper: {
    fetchAllDashboardData: jest.fn().mockResolvedValue({
      progressLogs: [],
      currentGoal: null,
      goalPlan: null,
      errors: []
    })
  }
}));

jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn()
}));

jest.mock('react-toastify', () => ({
  toast: {
    warning: jest.fn(),
    error: jest.fn()
  }
}));

describe('useDashboardData Hook', () => {
  test('should have all required setter functions', () => {
    const { result } = renderHook(() => useDashboardData());
    
    // Check that all setter functions exist
    expect(result.current.setDailyCigarettes).toBeDefined();
    expect(result.current.setPackPrice).toBeDefined();
    expect(result.current.setHealthConditions).toBeDefined();
    expect(result.current.setAllergies).toBeDefined();
    expect(result.current.setMedications).toBeDefined();
    expect(result.current.setPreviousHealthIssues).toBeDefined();
    
    // Check that all state variables exist
    expect(result.current.dailyCigarettes).toBeDefined();
    expect(result.current.packPrice).toBeDefined();
    expect(result.current.healthConditions).toBeDefined();
    expect(result.current.allergies).toBeDefined();
    expect(result.current.medications).toBeDefined();
    expect(result.current.previousHealthIssues).toBeDefined();
  });

  test('should initialize with default values', () => {
    const { result } = renderHook(() => useDashboardData());
    
    expect(result.current.dailyCigarettes).toBe(0);
    expect(result.current.packPrice).toBe(25000);
    expect(result.current.healthConditions).toBe("");
    expect(result.current.allergies).toBe("");
    expect(result.current.medications).toBe("");
    expect(result.current.previousHealthIssues).toBe("");
  });
});
