# TriggerFactor API Integration Update

## Tổng quan
Đã cập nhật code để phù hợp với Swagger API specification mới của TriggerFactor backend.

## Các file được tạo/cập nhật

### 1. File mới: `src/api/triggerFactorService.js`
Service chính để gọi TriggerFactor API, tuân thủ theo Swagger specification:

**API Endpoints được implement:**
- `GET /api/TriggerFactor/GetAllTriggerFactor` - Lấy tất cả trigger factors
- `GET /api/TriggerFactor/Get-MyTriggerFactor` - Lấy trigger factors của user hiện tại
- `POST /api/TriggerFactor/Create-TriggerFactor` - Tạo trigger factor mới
- `PUT /api/TriggerFactor/Update-TriggerFactor/{id}` - Cập nhật trigger factor
- `DELETE /api/TriggerFactor/removeTriggerFactorAtMember/{triggerId}` - Xóa trigger factor khỏi member
- `POST /api/TriggerFactor/assign/{memberId}` - Gán trigger factors cho member cụ thể
- `POST /api/TriggerFactor/assign` - Gán trigger factors cho user hiện tại
- `DELETE /api/TriggerFactor/Delete-TriggerFactor/{id}` - Xóa hoàn toàn trigger factor

**Helper functions:**
- `createAndAssignTriggerFactor(name)` - Tạo và gán trigger factor trong một lần gọi

### 2. Cập nhật: `src/utils/apiHelper.js`
Thêm các function wrapper cho TriggerFactor API:
- `fetchAllTriggerFactors()`
- `fetchMyTriggerFactors()`
- `createTriggerFactor(name)`
- `createAndAssignTriggerFactor(name)`
- `updateTriggerFactor(id, updateData)`
- `removeTriggerFactorFromMember(triggerId)`
- `assignTriggerFactorsToCurrentUser(triggerIds)`
- `deleteTriggerFactor(id)`

### 3. Cập nhật: `src/components/profile/tabs/SmokingHabitsTab.jsx`
Refactor để sử dụng service mới:
- ✅ Sử dụng `ApiHelper.fetchMyTriggerFactors()` thay vì gọi trực tiếp API
- ✅ Sử dụng `ApiHelper.createAndAssignTriggerFactor()` cho việc tạo trigger mới
- ✅ Sử dụng `ApiHelper.removeTriggerFactorFromMember()` cho việc xóa
- ✅ Sử dụng `ApiHelper.updateTriggerFactor()` cho việc cập nhật
- ✅ Cải thiện error handling với message từ service

### 4. Cập nhật: `src/components/profile/Profile_backup.jsx`
Cập nhật để sử dụng service mới:
- ✅ Import TriggerFactorService và ApiHelper
- ✅ Sử dụng `ApiHelper.fetchMyTriggerFactors()` thay vì gọi trực tiếp API
- ✅ Cải thiện error handling

### 5. File mới: `src/components/debug/TriggerFactorTest.jsx`
Component test hoàn chỉnh để kiểm tra tất cả TriggerFactor API endpoints:
- ✅ Test GET all trigger factors
- ✅ Test GET my trigger factors  
- ✅ Test POST create trigger factor
- ✅ Test POST create & assign trigger factor
- ✅ Test PUT update trigger factor
- ✅ Test DELETE remove from member
- ✅ Test POST assign to current user
- ✅ Test DELETE completely delete trigger factor
- ✅ UI thân thiện với user để test manual

### 6. Cập nhật: `src/pages/DebugPage.jsx`
Thêm tab mới cho TriggerFactor test:
- ✅ Tab "TriggerFactor API Test" để test các API endpoints

## Schema Data Types

### TriggerFactor Object
```javascript
{
  "triggerId": number,
  "createdAt": "2025-08-04T08:26:42.586Z",
  "updatedAt": "2025-08-04T08:26:42.586Z", 
  "name": "string"
}
```

### Create TriggerFactor Request
```javascript
{
  "createdAt": "2025-08-04T08:26:42.590Z",
  "name": "string"
}
```

### Update TriggerFactor Request
```javascript
{
  "name": "string",
  "updatedAt": "2025-08-04T08:26:42.592Z"
}
```

### Assign TriggerFactors Request
```javascript
[0] // Array of trigger factor IDs
```

## Cách sử dụng

### Import service
```javascript
import { TriggerFactorService } from '../../../api/triggerFactorService';
import ApiHelper from '../../../utils/apiHelper';
```

### Lấy trigger factors của user hiện tại
```javascript
const myTriggers = await ApiHelper.fetchMyTriggerFactors();
```

### Tạo và gán trigger factor mới
```javascript
await ApiHelper.createAndAssignTriggerFactor("Stress");
```

### Xóa trigger factor khỏi user
```javascript
await ApiHelper.removeTriggerFactorFromMember(triggerId);
```

## Testing

Để test TriggerFactor API:
1. Vào trang `/debug` 
2. Chọn tab "TriggerFactor API Test"
3. Test từng chức năng:
   - Tạo trigger factor mới
   - Gán trigger factor cho user hiện tại
   - Cập nhật tên trigger factor
   - Xóa trigger factor khỏi user
   - Xóa hoàn toàn trigger factor

## Error Handling

Tất cả API calls đều có proper error handling:
- ✅ Catch và re-throw errors với message phù hợp
- ✅ Log chi tiết để debug
- ✅ Toast notifications cho user
- ✅ Fallback values để tránh crashes

## Backward Compatibility

- ✅ Các component khác không bị ảnh hưởng
- ✅ Các API calls cũ vẫn hoạt động nhờ wrapper functions
- ✅ UI/UX không thay đổi đối với end user

## Notes

1. **API Base URL**: Tất cả calls đều sử dụng axios instance đã configured với base URL và authentication
2. **Error Messages**: Tất cả error messages đều được localize (tiếng Việt)
3. **Logging**: Extensive console logging để debug
4. **Type Safety**: Tuân thủ theo Swagger schema definitions
5. **Performance**: Sử dụng Promise.all cho concurrent requests khi có thể
