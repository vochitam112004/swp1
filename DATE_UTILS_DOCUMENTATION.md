# Date and API Utilities Documentation

## Tổng quan

Đây là tài liệu hướng dẫn sử dụng các utility functions mới được tạo để xử lý ngày tháng và API calls một cách an toàn và nhất quán trong dự án.

## 📅 DateUtils

### Mục đích
- Xử lý tính toán ngày tháng an toàn, tránh lỗi overflow tháng
- Chuẩn hóa format ngày tháng
- Xử lý timezone và các edge cases
- Normalize field names không nhất quán

### Các functions chính

#### `addDays(date, days)`
Thêm số ngày vào một ngày một cách an toàn.
```javascript
const result = DateUtils.addDays('2025-01-31', 7);
// Kết quả: 2025-02-07 (xử lý đúng cuối tháng)
```

#### `addWeeks(date, weeks)`
Thêm số tuần vào một ngày.
```javascript
const result = DateUtils.addWeeks('2025-01-01', 2);
// Kết quả: 2025-01-15
```

#### `daysDifference(endDate, startDate)`
Tính số ngày chênh lệch giữa hai ngày.
```javascript
const days = DateUtils.daysDifference('2025-02-01', '2025-01-01');
// Kết quả: 31
```

#### `normalizeFields(obj)`
Chuẩn hóa tên field trong object từ database.
```javascript
const normalized = DateUtils.normalizeFields({
  logDate: '2025-01-01',      // -> date
  StartDate: '2025-01-01',    // -> startDate
  TargetQuitDate: '2025-02-01' // -> targetQuitDate
});
```

#### `getDateRange(days)`
Tạo range ngày cho filtering.
```javascript
const range = DateUtils.getDateRange(7); // 7 ngày gần nhất
// Kết quả: { startDate: Date, endDate: Date }
```

## 🔄 ApiHelper

### Mục đích
- Chuẩn hóa API calls
- Xử lý lỗi nhất quán
- Normalize dữ liệu từ database
- Optimize performance với Promise.allSettled

### Các functions chính

#### `fetchProgressLogs()`
Lấy danh sách progress logs với date normalization.
```javascript
const logs = await ApiHelper.fetchProgressLogs();
// Tự động sort theo ngày và normalize fields
```

#### `fetchAllDashboardData()`
Lấy tất cả dữ liệu dashboard với error handling.
```javascript
const { progressLogs, currentGoal, goalPlan, errors } = await ApiHelper.fetchAllDashboardData();
// Không fail nếu một API call lỗi
```

#### `createGoalPlan(planData)`
Tạo goal plan với proper date handling.
```javascript
const plan = await ApiHelper.createGoalPlan({
  startDate: '2025-01-01',
  targetQuitDate: '2025-02-01',
  personalMotivation: 'Health improvement'
});
```

## 🔧 Cách sử dụng trong components

### 1. Import utilities
```javascript
import { DateUtils } from '../../utils/dateUtils';
import { ApiHelper } from '../../utils/apiHelper';
```

### 2. Thay thế date calculations cũ
```javascript
// ❌ Cũ - có thể gây lỗi
const end = new Date(startDate);
end.setDate(end.getDate() + (weeks * 7));

// ✅ Mới - an toàn
const end = DateUtils.addWeeks(startDate, weeks);
```

### 3. Thay thế API calls cũ
```javascript
// ❌ Cũ - không handle errors
const [logs, goal] = await Promise.all([
  api.get("/ProgressLog/GetProgress-logs"),
  api.get("/CurrentGoal")
]);

// ✅ Mới - handle errors và normalize data
const { progressLogs, currentGoal, errors } = await ApiHelper.fetchAllDashboardData();
```

### 4. Normalize dữ liệu
```javascript
// ❌ Cũ - phải check nhiều field names
const date = log.date || log.logDate || log.Date;

// ✅ Mới - tự động normalize
const normalizedLog = DateUtils.normalizeFields(log);
const date = normalizedLog.date;
```

## 🧪 Testing

Sử dụng test file để verify tính toán:
```javascript
// Trong browser console
DateUtilsTests.runAllTests();

// Hoặc test từng phần
DateUtilsTests.testDateCalculations();
DateUtilsTests.testEdgeCases();
```

## ⚠️ Lưu ý quan trọng

### 1. Timezone handling
- Tất cả dates được normalize về start/end of day
- Sử dụng `startOfDay()` và `endOfDay()` cho filtering

### 2. Error handling
- API calls sử dụng `Promise.allSettled` để không fail toàn bộ
- Log errors nhưng vẫn trả về partial data

### 3. Performance
- DateUtils functions được optimize cho performance
- Cache kết quả khi có thể

### 4. Backward compatibility
- Vẫn support old field names thông qua normalization
- Có thể migrate từ từ components cũ

## 🐛 Các vấn đề đã fix

### 1. Date overflow issues
```javascript
// ❌ Problem: 2025-01-31 + 1 day = 2025-03-03 (wrong!)
const wrong = new Date('2025-01-31');
wrong.setDate(wrong.getDate() + 31);

// ✅ Fixed: Proper month handling
const correct = DateUtils.addDays('2025-01-31', 31);
```

### 2. Inconsistent field names
```javascript
// ❌ Problem: Multiple field name variations
const date = item.date || item.logDate || item.Date || item.LogDate;

// ✅ Fixed: Automatic normalization
const normalizedItem = DateUtils.normalizeFields(item);
const date = normalizedItem.date;
```

### 3. API error handling
```javascript
// ❌ Problem: One failed API breaks everything
const [logs, goal] = await Promise.all([...]);

// ✅ Fixed: Graceful error handling
const { progressLogs, currentGoal, errors } = await ApiHelper.fetchAllDashboardData();
```

## 📈 Migration Guide

### Từng bước migrate existing components:

1. **Import utilities**
2. **Replace date calculations** với DateUtils functions
3. **Replace API calls** với ApiHelper functions
4. **Update data filtering** với normalized fields
5. **Test thoroughly** với test suite

### Example migration:
```javascript
// Before
const filtered = data.filter(item => {
  const itemDate = new Date(item.date || item.logDate);
  const startDate = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
  return itemDate >= startDate;
});

// After
const filtered = data.filter(item => {
  const itemDate = DateUtils.startOfDay(DateUtils.normalizeFields(item).date);
  const { startDate } = DateUtils.getDateRange(7);
  return itemDate >= startDate;
});
```

## 🎯 Best Practices

1. **Always use DateUtils** cho date calculations
2. **Always normalize data** khi nhận từ API
3. **Handle errors gracefully** với ApiHelper
4. **Test edge cases** với test suite
5. **Log warnings** cho debugging
6. **Keep backward compatibility** khi migrate

## 📞 Support

Nếu gặp vấn đề khi sử dụng utilities:
1. Check console để xem error logs
2. Run test suite để verify tính toán
3. Check network tab để debug API calls
4. Kiểm tra data normalization với `normalizeFields()`
