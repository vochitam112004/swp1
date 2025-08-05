// API Test Script - Paste vào Browser Console để test
// Thay đổi BASE_URL và TOKEN nếu cần

const BASE_URL = 'https://681e8423c309.ngrok-free.app/api';
const TOKEN = localStorage.getItem('authToken');

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Authorization': `Bearer ${TOKEN}`,
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true'
  }
});

console.log('🧪 Starting API Tests...');
console.log('Base URL:', BASE_URL);
console.log('Token exists:', !!TOKEN);

// Test 1: Kiểm tra endpoints hiện có
async function testCurrentEndpoints() {
  console.log('\n🔍 Testing Current Endpoints...');
  
  const tests = [
    {
      name: 'Get All Trigger Factors',
      method: 'get',
      url: '/TriggerFactor/GetAllTriggerFactor'
    },
    {
      name: 'Get My Trigger Factors',
      method: 'get', 
      url: '/TriggerFactor/Get-MyTriggerFactor'
    },
    {
      name: 'Get My Member Profile',
      method: 'get',
      url: '/MemberProfile/GetMyMemberProfile'
    }
  ];

  for (const test of tests) {
    try {
      const response = await api[test.method](test.url);
      console.log(`✅ ${test.name}:`, response.data);
    } catch (error) {
      console.log(`❌ ${test.name}:`, error.response?.status, error.response?.data);
    }
  }
}

// Test 2: Kiểm tra endpoints missing
async function testMissingEndpoints() {
  console.log('\n🔍 Testing Missing Endpoints...');
  
  const memberId = 1; // Thay bằng memberId thực tế
  
  const missingTests = [
    {
      name: 'Get Member Triggers (Option 1)',
      method: 'get',
      url: `/TriggerFactor/GetMemberTriggerFactors/${memberId}`
    },
    {
      name: 'Get Member Triggers (Option 2)',
      method: 'get',
      url: `/TriggerFactor/Get-MyTriggerFactor?memberId=${memberId}`
    },
    {
      name: 'Get Member Triggers (Option 3)',
      method: 'get',
      url: `/TriggerFactor/GetByMember/${memberId}`
    },
    {
      name: 'Get Member Triggers (Option 4)',
      method: 'get',
      url: `/TriggerFactor/GetMemberTriggers?memberId=${memberId}`
    }
  ];

  for (const test of missingTests) {
    try {
      const response = await api[test.method](test.url);
      console.log(`✅ ${test.name} - WORKS!:`, response.data);
      console.log(`🎯 Use this endpoint: ${test.url}`);
    } catch (error) {
      console.log(`❌ ${test.name}:`, error.response?.status, error.response?.statusText);
    }
  }
}

// Test 3: Test assign functionality
async function testAssignFunctionality() {
  console.log('\n🔍 Testing Assign Functionality...');
  
  const memberId = 1; // Thay bằng memberId thực tế
  const triggerIds = [1]; // Thay bằng trigger IDs thực tế
  
  try {
    // Test assign to specific member
    const response = await api.post(`/TriggerFactor/assign/${memberId}`, triggerIds);
    console.log('✅ Assign to member works:', response.data);
    
    // Test if we can get the assigned triggers back
    await testMissingEndpoints();
    
  } catch (error) {
    console.log('❌ Assign to member failed:', error.response?.status, error.response?.data);
  }
  
  try {
    // Test assign to current user
    const response = await api.post('/TriggerFactor/assign', triggerIds);
    console.log('✅ Assign to current user works:', response.data);
  } catch (error) {
    console.log('❌ Assign to current user failed:', error.response?.status, error.response?.data);
  }
}

// Test 4: Get member profile to find memberId
async function getMemberIds() {
  console.log('\n🔍 Getting Member IDs...');
  
  try {
    // Get current user's member profile
    const myProfile = await api.get('/MemberProfile/GetMyMemberProfile');
    console.log('📝 My Member Profile:', myProfile.data);
    console.log('📝 My Member ID:', myProfile.data?.memberId);
    
    // Try to get all users (if available)
    try {
      const users = await api.get('/User/Get-All-User');
      const members = users.data.filter(u => u.userType === 'Member');
      console.log('📝 Available Members:', members.map(m => ({
        userId: m.userId,
        displayName: m.displayName,
        userType: m.userType
      })));
      
      // Try to get member profiles for each user
      for (const member of members.slice(0, 3)) { // Test first 3 only
        try {
          const profile = await api.get(`/MemberProfile/GetMemberProfileByUserId/${member.userId}`);
          console.log(`📝 Member ${member.displayName} (userId: ${member.userId}) -> memberId: ${profile.data?.memberId}`);
        } catch (error) {
          console.log(`⚠️ No profile for ${member.displayName} (userId: ${member.userId})`);
        }
      }
      
    } catch (error) {
      console.log('⚠️ Cannot get all users:', error.response?.status);
    }
    
  } catch (error) {
    console.log('❌ Cannot get member profile:', error.response?.status);
  }
}

// Chạy tất cả tests
async function runAllTests() {
  await testCurrentEndpoints();
  await getMemberIds();
  await testMissingEndpoints();
  await testAssignFunctionality();
  
  console.log('\n🏁 Tests completed!');
  console.log('\n📋 Summary:');
  console.log('- Kiểm tra console logs phía trên');
  console.log('- Nếu có endpoint nào trả về ✅ WORKS!, đó là endpoint cần dùng');
  console.log('- Nếu tất cả đều ❌, cần implement ở backend');
}

// Chạy ngay
runAllTests().catch(console.error);

// Export functions để có thể gọi riêng lẻ
window.apiTests = {
  testCurrentEndpoints,
  testMissingEndpoints, 
  testAssignFunctionality,
  getMemberIds,
  runAllTests
};

console.log('💡 Tip: Có thể gọi riêng lẻ bằng:');
console.log('- apiTests.testCurrentEndpoints()');
console.log('- apiTests.getMemberIds()');
console.log('- apiTests.testMissingEndpoints()');
console.log('- apiTests.testAssignFunctionality()');
