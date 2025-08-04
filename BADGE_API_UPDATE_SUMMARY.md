# Badge API Update Summary

## Changes Made

### 1. API Endpoint Updated
- **Old API**: `/Badge/My-Badge`, `/Badge/user-badges`
- **New API**: `/Badge/get-my-badges`

### 2. Response Structure Changed
**Old Response Structure:**
```json
// Array of badges or single badge object
[
  {
    "iconUrl": "string",
    "name": "string"
  }
]
```

**New Response Structure:**
```json
{
  "userId": 3,
  "username": "tu",
  "fullName": "Tu pro",
  "avatarUrl": "/uploads/avatars/628f82a8-ec94-43d3-a557-123a18120564.jpg",
  "score": 70,
  "badges": [
    {
      "badgeId": 4,
      "name": "1 ngày cai thuốc",
      "iconUrl": "/uploads/badges/c1e32cc8-257d-4ab4-b0d3-d1a10dc34a05.jpg"
    }
  ]
}
```

### 3. Files Updated

#### 3.1 Core Service Created
- **New File**: `src/api/badgeService.js`
  - Centralized badge API calls
  - Error handling
  - Consistent response format

#### 3.2 Profile Components Updated
- `src/components/profile/UnifiedProfilePage.jsx`
  - Updated `fetchBadges()` function to use new API
  - Extract badges from `response.data.badges`

- `src/components/profile/tabs/BadgesTab.jsx`
  - Updated to use `badgeService.getMyBadges()`
  - Improved error handling

- `src/components/profile/tabs/AccountTab.jsx`
  - Updated badge fetching logic
  - Extract badges from new response structure

- `src/components/profile/Profile_backup.jsx`
  - Updated API call to new endpoint
  - Extract badges from new response structure

#### 3.3 Debug Component Added
- **New File**: `src/components/debug/BadgeAPITest.jsx`
  - Test component for the new Badge API
  - Visual verification of API response
  - Shows user info and badges

- `src/pages/DebugPage.jsx`
  - Added Badge API Test tab

### 4. Key Changes in Data Handling

#### Before:
```javascript
const res = await api.get("/Badge/My-Badge");
const data = res.data;
if (Array.isArray(data)) {
  setBadges(data);
} else if (data?.iconUrl) {
  setBadges([data]);
}
```

#### After:
```javascript
const result = await badgeService.getMyBadges();
if (result.success) {
  setBadges(result.badges); // Always an array
}
```

### 5. Additional Benefits
- **Better Error Handling**: Centralized error handling in badgeService
- **Type Safety**: Consistent data structure
- **Additional User Info**: New API provides user score, avatar, etc.
- **Badge IDs**: Each badge now has a unique `badgeId`

### 6. Testing
To test the new API:
1. Navigate to `/debug` page (requires login)
2. Click on "Badge API Test" tab
3. The component will automatically test the new API endpoint
4. Check console for detailed API response

### 7. Files That Still Need Backend Updates
- `src/components/coach/CoachMemberProfileEditor.jsx` 
  - Currently uses `/Badge/GetByMemberId/${memberId}`
  - May need backend update for coach to view member badges

- `src/components/dashboard/BXH.jsx`
  - Uses `/Badge/GetAllBadge` for ranking page

- `src/components/admin/BadgeManager.jsx`
  - Admin functions should remain the same (Create, Update, Delete)

## Next Steps
1. Test the updated components in development
2. Verify the new API works correctly with authentication
3. Update any remaining endpoints as needed
4. Consider updating coach-specific badge viewing functionality
