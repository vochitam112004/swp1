import React, { useState } from 'react';
import { TriggerFactorService } from '../../api/triggerFactorService';
import '../../css/Dashboard.css';

export default function TriggerFactorApiTest() {
  const [loading, setLoading] = useState(false);
  const [allTriggers, setAllTriggers] = useState([]);
  const [myTriggers, setMyTriggers] = useState([]);
  const [testResults, setTestResults] = useState({});

  const testGetAllTriggers = async () => {
    setLoading(true);
    try {
      console.log('🧪 Testing GetAllTriggerFactor API...');
      const result = await TriggerFactorService.getAllTriggerFactors();
      setAllTriggers(result);
      setTestResults(prev => ({ 
        ...prev, 
        getAllTriggers: { 
          success: true, 
          count: result.length, 
          data: result.slice(0, 3), // Show only first 3 items for display
          fullData: result
        } 
      }));
      console.log(`✅ GetAllTriggers: Found ${result.length} triggers`);
    } catch (error) {
      console.error('❌ GetAllTriggers test failed:', error);
      setTestResults(prev => ({ 
        ...prev, 
        getAllTriggers: { success: false, error: error.message } 
      }));
    } finally {
      setLoading(false);
    }
  };

  const testGetMyTriggers = async () => {
    setLoading(true);
    try {
      console.log('🧪 Testing Get-MyTriggerFactor API...');
      const result = await TriggerFactorService.getMyTriggerFactors();
      setMyTriggers(result);
      setTestResults(prev => ({ 
        ...prev, 
        getMyTriggers: { 
          success: true, 
          count: result.length, 
          data: result.slice(0, 3), // Show only first 3 items for display
          fullData: result
        } 
      }));
      console.log(`✅ GetMyTriggers: Found ${result.length} triggers`);
    } catch (error) {
      console.error('❌ GetMyTriggers test failed:', error);
      setTestResults(prev => ({ 
        ...prev, 
        getMyTriggers: { success: false, error: error.message } 
      }));
    } finally {
      setLoading(false);
    }
  };

  const testBothApis = async () => {
    await testGetAllTriggers();
    await testGetMyTriggers();
  };

  const clearResults = () => {
    setAllTriggers([]);
    setMyTriggers([]);
    setTestResults({});
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2>🧪 TriggerFactor API Debug Test</h2>
      
      <div style={{ 
        backgroundColor: '#e3f2fd', 
        padding: '15px', 
        borderRadius: '8px', 
        marginBottom: '20px',
        border: '1px solid #bbdefb'
      }}>
        <strong>ℹ️ Thông tin:</strong> Component này dùng để test và debug 2 API TriggerFactor:
        <ul>
          <li><code>GET /api/TriggerFactor/GetAllTriggerFactor</code> - Lấy tất cả trigger factors</li>
          <li><code>GET /api/TriggerFactor/Get-MyTriggerFactor</code> - Lấy trigger factors của user hiện tại</li>
        </ul>
        <strong>Hướng dẫn:</strong> Mở Developer Tools (F12) để xem chi tiết logs trong Console tab.
      </div>

      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button 
          onClick={testGetAllTriggers}
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? '⏳ Loading...' : '🔄 Test GetAllTriggers'}
        </button>
        
        <button 
          onClick={testGetMyTriggers}
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: '#7b1fa2',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? '⏳ Loading...' : '🔄 Test GetMyTriggers'}
        </button>
        
        <button 
          onClick={testBothApis}
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: '#388e3c',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? '⏳ Loading...' : '🚀 Test Both APIs'}
        </button>
        
        <button 
          onClick={clearResults}
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: '#d32f2f',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1
          }}
        >
          🗑️ Clear Results
        </button>
      </div>

      {/* Test Results Summary */}
      {Object.keys(testResults).length > 0 && (
        <div style={{ 
          backgroundColor: '#f5f5f5', 
          padding: '15px', 
          borderRadius: '8px', 
          marginBottom: '20px',
          border: '1px solid #ddd'
        }}>
          <h3>📊 Test Results Summary:</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px' }}>
            {testResults.getAllTriggers && (
              <div style={{ 
                padding: '10px', 
                borderRadius: '4px',
                backgroundColor: testResults.getAllTriggers.success ? '#e8f5e8' : '#ffeaea',
                border: `1px solid ${testResults.getAllTriggers.success ? '#4caf50' : '#f44336'}`
              }}>
                <strong>GetAllTriggers:</strong> {testResults.getAllTriggers.success ? '✅ Success' : '❌ Failed'}
                <br />
                {testResults.getAllTriggers.success ? (
                  <>Count: {testResults.getAllTriggers.count}</>
                ) : (
                  <>Error: {testResults.getAllTriggers.error}</>
                )}
              </div>
            )}
            
            {testResults.getMyTriggers && (
              <div style={{ 
                padding: '10px', 
                borderRadius: '4px',
                backgroundColor: testResults.getMyTriggers.success ? '#e8f5e8' : '#ffeaea',
                border: `1px solid ${testResults.getMyTriggers.success ? '#4caf50' : '#f44336'}`
              }}>
                <strong>GetMyTriggers:</strong> {testResults.getMyTriggers.success ? '✅ Success' : '❌ Failed'}
                <br />
                {testResults.getMyTriggers.success ? (
                  <>Count: {testResults.getMyTriggers.count}</>
                ) : (
                  <>Error: {testResults.getMyTriggers.error}</>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Detailed Results */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
        {/* All Triggers */}
        {allTriggers.length > 0 && (
          <div style={{ 
            backgroundColor: 'white', 
            padding: '15px', 
            borderRadius: '8px', 
            border: '1px solid #ddd',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h3>📋 All Triggers ({allTriggers.length}):</h3>
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {allTriggers.map((trigger, index) => (
                <div key={index} style={{ 
                  padding: '8px', 
                  marginBottom: '8px',
                  backgroundColor: '#f9f9f9',
                  borderRadius: '4px',
                  border: '1px solid #eee'
                }}>
                  <strong>{trigger.name}</strong>
                  <br />
                  <small>
                    ID: {trigger.triggerId} | 
                    Created: {new Date(trigger.createdAt).toLocaleDateString()}
                  </small>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* My Triggers */}
        {myTriggers.length > 0 && (
          <div style={{ 
            backgroundColor: 'white', 
            padding: '15px', 
            borderRadius: '8px', 
            border: '1px solid #ddd',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            <h3>👤 My Triggers ({myTriggers.length}):</h3>
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {myTriggers.map((trigger, index) => (
                <div key={index} style={{ 
                  padding: '8px', 
                  marginBottom: '8px',
                  backgroundColor: '#f0f8ff',
                  borderRadius: '4px',
                  border: '1px solid #b3d9ff'
                }}>
                  <strong>{trigger.name}</strong>
                  <br />
                  <small>
                    ID: {trigger.triggerId} | 
                    Created: {new Date(trigger.createdAt).toLocaleDateString()}
                  </small>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Raw Data (for debugging) */}
      {Object.keys(testResults).length > 0 && (
        <details style={{ marginTop: '20px' }}>
          <summary style={{ cursor: 'pointer', fontWeight: 'bold', padding: '10px' }}>
            🔍 Raw Test Results (for debugging)
          </summary>
          <pre style={{ 
            backgroundColor: '#f5f5f5', 
            padding: '15px', 
            borderRadius: '4px',
            overflow: 'auto',
            fontSize: '12px',
            border: '1px solid #ddd'
          }}>
            {JSON.stringify(testResults, null, 2)}
          </pre>
        </details>
      )}
    </div>
  );
}
