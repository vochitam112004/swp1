/**
 * Utility functions for testing and debugging TriggerFactor API
 */

import { TriggerFactorService } from '../api/triggerFactorService';

export const TriggerFactorApiHelper = {
  /**
   * Test both APIs and return comprehensive results
   */
  testAllApis: async () => {
    console.log('🧪 Starting comprehensive TriggerFactor API test...');
    
    const results = {
      timestamp: new Date().toISOString(),
      getAllTriggers: null,
      getMyTriggers: null,
      summary: {}
    };

    // Test GetAllTriggerFactor
    try {
      console.log('🔄 Testing GetAllTriggerFactor...');
      const allTriggers = await TriggerFactorService.getAllTriggerFactors();
      results.getAllTriggers = {
        success: true,
        count: allTriggers.length,
        data: allTriggers,
        sampleData: allTriggers.slice(0, 3) // First 3 items for preview
      };
      console.log(`✅ GetAllTriggerFactor: Success (${allTriggers.length} items)`);
    } catch (error) {
      results.getAllTriggers = {
        success: false,
        error: error.message,
        errorDetails: {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data
        }
      };
      console.log('❌ GetAllTriggerFactor: Failed', error);
    }

    // Test Get-MyTriggerFactor
    try {
      console.log('🔄 Testing Get-MyTriggerFactor...');
      const myTriggers = await TriggerFactorService.getMyTriggerFactors();
      results.getMyTriggers = {
        success: true,
        count: myTriggers.length,
        data: myTriggers,
        sampleData: myTriggers.slice(0, 3) // First 3 items for preview
      };
      console.log(`✅ Get-MyTriggerFactor: Success (${myTriggers.length} items)`);
    } catch (error) {
      results.getMyTriggers = {
        success: false,
        error: error.message,
        errorDetails: {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data
        }
      };
      console.log('❌ Get-MyTriggerFactor: Failed', error);
    }

    // Generate summary
    results.summary = {
      totalTests: 2,
      successful: [results.getAllTriggers?.success, results.getMyTriggers?.success].filter(Boolean).length,
      failed: [results.getAllTriggers?.success === false, results.getMyTriggers?.success === false].filter(Boolean).length,
      allTriggerCount: results.getAllTriggers?.count || 0,
      myTriggerCount: results.getMyTriggers?.count || 0
    };

    console.log('📊 Test Summary:', results.summary);
    return results;
  },

  /**
   * Quick health check for APIs
   */
  healthCheck: async () => {
    console.log('🏥 Running TriggerFactor API health check...');
    
    const health = {
      timestamp: new Date().toISOString(),
      apiStatus: 'unknown',
      authStatus: 'unknown',
      details: {}
    };

    try {
      // Try a simple call to check connectivity
      const response = await TriggerFactorService.getAllTriggerFactors();
      health.apiStatus = 'healthy';
      health.details.getAllTriggers = {
        available: true,
        count: response.length
      };
    } catch (error) {
      health.apiStatus = 'unhealthy';
      health.details.getAllTriggers = {
        available: false,
        error: error.message,
        status: error.response?.status
      };
    }

    try {
      // Check auth-dependent endpoint
      const response = await TriggerFactorService.getMyTriggerFactors();
      health.authStatus = 'authenticated';
      health.details.getMyTriggers = {
        available: true,
        count: response.length
      };
    } catch (error) {
      if (error.response?.status === 401) {
        health.authStatus = 'unauthenticated';
      } else {
        health.authStatus = 'error';
      }
      health.details.getMyTriggers = {
        available: false,
        error: error.message,
        status: error.response?.status
      };
    }

    console.log('🏥 Health check result:', health);
    return health;
  },

  /**
   * Format API response for display
   */
  formatTriggerData: (triggers) => {
    if (!Array.isArray(triggers)) {
      return [];
    }

    return triggers.map(trigger => ({
      id: trigger.triggerId,
      name: trigger.name,
      createdAt: new Date(trigger.createdAt).toLocaleDateString('vi-VN'),
      updatedAt: new Date(trigger.updatedAt).toLocaleDateString('vi-VN'),
      raw: trigger
    }));
  },

  /**
   * Generate test report
   */
  generateReport: (testResults) => {
    const report = {
      title: 'TriggerFactor API Test Report',
      timestamp: testResults.timestamp,
      summary: testResults.summary,
      details: []
    };

    if (testResults.getAllTriggers) {
      report.details.push({
        api: 'GetAllTriggerFactor',
        endpoint: '/api/TriggerFactor/GetAllTriggerFactor',
        status: testResults.getAllTriggers.success ? 'Success' : 'Failed',
        count: testResults.getAllTriggers.count || 0,
        error: testResults.getAllTriggers.error || null
      });
    }

    if (testResults.getMyTriggers) {
      report.details.push({
        api: 'Get-MyTriggerFactor',
        endpoint: '/api/TriggerFactor/Get-MyTriggerFactor',
        status: testResults.getMyTriggers.success ? 'Success' : 'Failed',
        count: testResults.getMyTriggers.count || 0,
        error: testResults.getMyTriggers.error || null
      });
    }

    return report;
  }
};

export default TriggerFactorApiHelper;
