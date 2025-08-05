/**
 * Simple script to test TriggerFactor APIs
 * Run this in browser console or add to a test page
 */

// Function to test APIs
window.testTriggerFactorAPIs = async function() {
  console.log('🧪 Starting TriggerFactor API Test...');
  console.log('==========================================');
  
  const baseURL = window.location.origin + '/api';
  console.log('🌐 Base URL:', baseURL);
  
  // Get auth token (assuming it's stored in localStorage)
  const token = localStorage.getItem('token') || localStorage.getItem('authToken');
  console.log('🔑 Auth token found:', !!token);
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
  
  console.log('📋 Request headers:', headers);
  console.log('==========================================');

  // Test 1: GetAllTriggerFactor
  console.log('🔄 Test 1: GetAllTriggerFactor');
  try {
    const response1 = await fetch(`${baseURL}/TriggerFactor/GetAllTriggerFactor`, {
      method: 'GET',
      headers: headers
    });
    
    console.log('📊 Response 1 status:', response1.status);
    console.log('📊 Response 1 headers:', [...response1.headers.entries()]);
    
    if (response1.ok) {
      const data1 = await response1.json();
      console.log('✅ GetAllTriggerFactor SUCCESS');
      console.log('📄 Data type:', typeof data1);
      console.log('📄 Is array:', Array.isArray(data1));
      console.log('📄 Count:', Array.isArray(data1) ? data1.length : 'N/A');
      console.log('📄 Sample data:', data1);
      
      if (Array.isArray(data1) && data1.length > 0) {
        console.log('📄 First item structure:', data1[0]);
      }
    } else {
      const errorText = await response1.text();
      console.log('❌ GetAllTriggerFactor FAILED');
      console.log('📄 Error text:', errorText);
    }
  } catch (error) {
    console.log('❌ GetAllTriggerFactor ERROR:', error);
  }
  
  console.log('==========================================');

  // Test 2: Get-MyTriggerFactor
  console.log('🔄 Test 2: Get-MyTriggerFactor');
  try {
    const response2 = await fetch(`${baseURL}/TriggerFactor/Get-MyTriggerFactor`, {
      method: 'GET',
      headers: headers
    });
    
    console.log('📊 Response 2 status:', response2.status);
    console.log('📊 Response 2 headers:', [...response2.headers.entries()]);
    
    if (response2.ok) {
      const data2 = await response2.json();
      console.log('✅ Get-MyTriggerFactor SUCCESS');
      console.log('📄 Data type:', typeof data2);
      console.log('📄 Is array:', Array.isArray(data2));
      console.log('📄 Count:', Array.isArray(data2) ? data2.length : 'N/A');
      console.log('📄 Sample data:', data2);
      
      if (Array.isArray(data2) && data2.length > 0) {
        console.log('📄 First item structure:', data2[0]);
      }
    } else {
      const errorText = await response2.text();
      console.log('❌ Get-MyTriggerFactor FAILED');
      console.log('📄 Error text:', errorText);
      
      if (response2.status === 401) {
        console.log('🔑 Authentication required - please login first');
      }
    }
  } catch (error) {
    console.log('❌ Get-MyTriggerFactor ERROR:', error);
  }
  
  console.log('==========================================');
  console.log('✅ TriggerFactor API Test Complete');
  console.log('');
  console.log('💡 Tips:');
  console.log('- Check Network tab in DevTools for detailed request/response');
  console.log('- Ensure you are logged in for Get-MyTriggerFactor');
  console.log('- Check API server is running and accessible');
  console.log('==========================================');
};

// Auto-run if in browser
if (typeof window !== 'undefined') {
  console.log('🚀 TriggerFactor API Test Script Loaded');
  console.log('Run: testTriggerFactorAPIs() to start testing');
}
