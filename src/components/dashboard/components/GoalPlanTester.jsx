import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../../api/axios';
import { DateUtils } from '../../../utils/dateUtils';

/**
 * Component kiểm tra và test GoalPlan API
 * Sử dụng để validate data structure và API responses
 */
const GoalPlanTester = () => {
  const [currentPlan, setCurrentPlan] = useState(null);
  const [apiResponse, setApiResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [testResults, setTestResults] = useState([]);

  // Test data for creating new plan
  const [testPlanData, setTestPlanData] = useState({
    startDate: DateUtils.toISODateString(new Date()),
    personalMotivation: 'Test motivation - Vì sức khỏe và gia đình',
    totalWeeks: 4
  });

  // Utility to add test result
  const addTestResult = (test, status, details) => {
    const result = {
      test,
      status, // 'pass', 'fail', 'warning'  
      details,
      timestamp: new Date().toLocaleTimeString()
    };
    setTestResults(prev => [...prev, result]);
  };

  // Test 1: GET current plan
  const testGetCurrentPlan = async () => {
    setLoading(true);
    addTestResult('GET Current Plan', 'testing', 'Starting API call...');
    
    try {
      const response = await api.get('/GoalPlan/current-goal');
      setCurrentPlan(response.data);
      setApiResponse(response.data);
      
      // Validate response structure
      const plan = response.data;
      if (plan) {
        const hasStartDate = plan.startDate || plan.StartDate;
        const hasTargetDate = plan.targetQuitDate || plan.TargetQuitDate;
        const hasMotivation = plan.personalMotivation || plan.PersonalMotivation;
        
        addTestResult('GET Current Plan', 'pass', 
          `Plan found. Fields: startDate=${!!hasStartDate}, targetQuitDate=${!!hasTargetDate}, motivation=${!!hasMotivation}`);
        
        // Test date calculations
        if (hasStartDate && hasTargetDate) {
          const startDate = hasStartDate;
          const endDate = hasTargetDate;
          const daysDiff = DateUtils.daysDifference(endDate, startDate);
          
          addTestResult('Date Calculation', 'pass', 
            `Duration: ${daysDiff} days (${startDate} -> ${endDate})`);
        } else {
          addTestResult('Date Calculation', 'warning', 'Missing start or end date');
        }
      } else {
        addTestResult('GET Current Plan', 'warning', 'No current plan found (404)');
      }
    } catch (error) {
      addTestResult('GET Current Plan', 'fail', 
        `Error: ${error.response?.status} - ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Test 2: CREATE new plan
  const testCreatePlan = async () => {
    setLoading(true);
    addTestResult('CREATE Plan', 'testing', 'Creating test plan...');
    
    try {
      // Calculate end date
      const endDate = DateUtils.addWeeks(testPlanData.startDate, testPlanData.totalWeeks);
      const payload = {
        startDate: testPlanData.startDate,
        targetQuitDate: DateUtils.toISODateString(endDate),
        personalMotivation: testPlanData.personalMotivation,
        isCurrentGoal: true
      };
      
      addTestResult('CREATE Plan Payload', 'info', JSON.stringify(payload, null, 2));
      
      const response = await api.post('/GoalPlan', payload);
      
      addTestResult('CREATE Plan', 'pass', 
        `Plan created successfully. ID: ${response.data.id || 'N/A'}`);
      
      // Refresh current plan
      await testGetCurrentPlan();
      
    } catch (error) {
      addTestResult('CREATE Plan', 'fail', 
        `Error: ${error.response?.status} - ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Test 3: Calculate duration helper
  const calculatePlanDuration = (plan) => {
    if (!plan) return 0;
    
    const startDate = plan.startDate || plan.StartDate;
    const endDate = plan.targetQuitDate || plan.TargetQuitDate;
    
    if (!startDate || !endDate) return 0;
    
    return DateUtils.daysDifference(endDate, startDate);
  };

  // Test 4: Field normalization
  const testFieldNormalization = () => {
    const testData = {
      StartDate: '2025-01-01',
      TargetQuitDate: '2025-02-01', 
      PersonalMotivation: 'Test motivation'
    };
    
    const normalized = DateUtils.normalizeFields(testData);
    
    addTestResult('Field Normalization', 'pass', 
      `Original: ${JSON.stringify(testData)} -> Normalized: ${JSON.stringify(normalized)}`);
  };

  useEffect(() => {
    // Run initial tests
    testFieldNormalization();
  }, []);

  return (
    <div className="goalplan-tester p-4">
      <div className="card">
        <div className="card-header">
          <h4>🧪 GoalPlan API Tester</h4>
          <p className="text-muted">Test và kiểm tra GoalPlan APIs và data structure</p>
        </div>
        
        <div className="card-body">
          {/* Test Controls */}
          <div className="test-controls mb-4">
            <div className="row">
              <div className="col-md-6">
                <h5>Test Controls</h5>
                <button 
                  className="btn btn-primary me-2 mb-2" 
                  onClick={testGetCurrentPlan}
                  disabled={loading}
                >
                  {loading ? 'Testing...' : 'Test GET Current Plan'}
                </button>
                
                <button 
                  className="btn btn-success me-2 mb-2" 
                  onClick={testCreatePlan}
                  disabled={loading}
                >
                  Test CREATE Plan
                </button>
                
                <button 
                  className="btn btn-info mb-2" 
                  onClick={() => setTestResults([])}
                >
                  Clear Results
                </button>
              </div>
              
              <div className="col-md-6">
                <h5>Test Plan Data</h5>
                <div className="mb-2">
                  <label>Start Date:</label>
                  <input 
                    type="date" 
                    className="form-control form-control-sm"
                    value={testPlanData.startDate}
                    onChange={(e) => setTestPlanData(prev => ({...prev, startDate: e.target.value}))}
                  />
                </div>
                <div className="mb-2">
                  <label>Duration (weeks):</label>
                  <input 
                    type="number" 
                    className="form-control form-control-sm"
                    value={testPlanData.totalWeeks}
                    onChange={(e) => setTestPlanData(prev => ({...prev, totalWeeks: parseInt(e.target.value)}))}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Current Plan Display */}
          {currentPlan && (
            <div className="current-plan mb-4">
              <h5>📋 Current Plan Data</h5>
              <div className="bg-light p-3 rounded">
                <div className="row">
                  <div className="col-md-6">
                    <strong>Start Date:</strong> {currentPlan.startDate || currentPlan.StartDate || 'N/A'}
                  </div>
                  <div className="col-md-6">  
                    <strong>End Date:</strong> {currentPlan.targetQuitDate || currentPlan.TargetQuitDate || 'N/A'}
                  </div>
                  <div className="col-12 mt-2">
                    <strong>Duration:</strong> {calculatePlanDuration(currentPlan)} days
                  </div>
                  <div className="col-12 mt-2">
                    <strong>Motivation:</strong> {currentPlan.personalMotivation || currentPlan.PersonalMotivation || 'N/A'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Test Results */}
          <div className="test-results">
            <h5>📊 Test Results</h5>
            <div className="results-container" style={{maxHeight: '400px', overflowY: 'auto'}}>
              {testResults.map((result, index) => (
                <div key={index} className={`test-result p-2 mb-2 rounded border-start border-3 border-${
                  result.status === 'pass' ? 'success' : 
                  result.status === 'fail' ? 'danger' : 
                  result.status === 'warning' ? 'warning' : 'info'
                }`}>
                  <div className="d-flex justify-content-between">
                    <strong>{result.test}</strong>
                    <small className="text-muted">{result.timestamp}</small>
                  </div>
                  <div className={`text-${
                    result.status === 'pass' ? 'success' : 
                    result.status === 'fail' ? 'danger' : 
                    result.status === 'warning' ? 'warning' : 'info'
                  }`}>
                    Status: {result.status.toUpperCase()}
                  </div>
                  <div className="small">
                    <pre style={{whiteSpace: 'pre-wrap', fontSize: '0.8em'}}>{result.details}</pre>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Raw API Response */}
          {apiResponse && (
            <div className="api-response mt-4">
              <h5>🔍 Raw API Response</h5>
              <pre className="bg-light p-3 rounded" style={{fontSize: '0.8em', maxHeight: '300px', overflow: 'auto'}}>
                {JSON.stringify(apiResponse, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GoalPlanTester;
