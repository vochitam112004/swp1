# GOALPLAN STATUS REPORT - Báo cáo tình trạng GoalPlan

## 📋 TỔNG QUAN HỆ THỐNG

### Phần đã hoàn thành ✅
1. **API Endpoints đã có:**
   - GET `/GoalPlan/current-goal` - Lấy kế hoạch hiện tại
   - POST `/GoalPlan` - Tạo kế hoạch mới
   - PUT `/GoalPlan/{id}` - Cập nhật kế hoạch
   - GET `/GoalPlanWeeklyReduction/plan/{planId}` - Lấy kế hoạch theo tuần
   - POST `/GoalPlanWeeklyReduction` - Tạo kế hoạch giảm theo tuần

2. **Cấu trúc dữ liệu GoalPlan:**
   ```javascript
   {
     id: number,
     startDate: string (ISO format),
     targetQuitDate: string (ISO format),
     personalMotivation: string,
     isCurrentGoal: boolean,
     // Các field có thể có tên khác do backend
     StartDate: string,
     TargetQuitDate: string,
     PersonalMotivation: string
   }
   ```

3. **Các tính năng UI đã có:**
   - Form tạo kế hoạch mới
   - Form chỉnh sửa kế hoạch
   - Hiển thị kế hoạch hiện tại
   - Kế hoạch giảm theo tuần
   - Tính toán ngày kết thúc tự động

4. **Utils hỗ trợ:**
   - `DateUtils` - Xử lý ngày tháng an toàn
   - `ApiHelper` - Wrapper cho API calls
   - Field normalization (xử lý trường dữ liệu khác nhau từ backend)

## 🔧 PHẦN CẦN KIỂM TRA/HOÀN THIỆN

### 1. Tính toán thời gian dự kiến
**Hiện tại:**
- Có function `calculateEndDate()` tính ngày kết thúc
- Có function `daysDifference()` tính số ngày chênh lệch
- Hiển thị thời gian dự kiến trong UI (hardcode 56 ngày)

**Cần cải thiện:**
- Tính toán thời gian dự kiến tự động từ startDate và targetQuitDate
- Hiển thị thời gian dự kiến động trong UI
- Validation thời gian hợp lệ

### 2. GET API - Kiểm tra
**Cần test:**
- Response format từ backend
- Field naming consistency
- Error handling
- Loading states

### 3. CREATE API - Kiểm tra  
**Cần test:**
- Payload format gửi lên backend
- Required fields validation
- Success/Error responses
- Auto-refresh sau khi tạo

### 4. UI/UX Improvements
**Cần bổ sung:**
- Hiển thị thời gian dự kiến realtime
- Validation form inputs
- Better error messages
- Progress indicators

## 📝 PLAN HOÀN THIỆN

### Bước 1: Tạo component kiểm tra GoalPlan
- Test GET API response
- Test CREATE API payload
- Validate field mappings

### Bước 2: Cải thiện tính toán thời gian
- Thêm function tính thời gian dự kiến tự động
- Cập nhật UI hiển thị thời gian động
- Thêm validation

### Bước 3: Test integration
- Test full flow tạo/sửa/hiển thị
- Test với data thực từ backend
- Fix bugs nếu có

## 📊 CÁC FILE LIÊN QUAN

1. **Core Components:**
   - `src/components/dashboard/PlanTabNew.jsx` - UI chính
   - `src/utils/apiHelper.js` - API wrapper
   - `src/utils/dateUtils.js` - Date utilities

2. **Related Components:**
   - `src/components/dashboard/hooks/useDashboardData.js` - Data hook
   - `src/components/coach/UserPlans.jsx` - Coach view

3. **CSS:**
   - `src/css/PlanTabNew.css` - Styling

## 🎯 KẾT LUẬN

GoalPlan đã có cơ bản đầy đủ các tính năng:
- ✅ API GET/CREATE đã implemented
- ✅ UI form tạo/sửa hoàn chỉnh  
- ✅ Date calculations có sẵn
- ⚠️ Cần test và fine-tune tính toán thời gian
- ⚠️ Cần cải thiện UI hiển thị thời gian dự kiến động

**Ưu tiên:** Test API responses và cải thiện tính toán thời gian dự kiến.
