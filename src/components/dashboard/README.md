# Dashboard Component Architecture

## Cấu trúc mới đã được tách

Dashboard component đã được tách thành các component nhỏ hơn để dễ quản lý và bảo trì:

### 📁 Cấu trúc thư mục

```
src/components/dashboard/
├── dashboard.jsx                    # Main dashboard component
├── dashboard.backup.jsx             # Backup của file cũ
├── constants/
│   └── dashboardConstants.js        # Constants và configurations
├── utils/
│   └── dashboardUtils.js           # Utility functions
├── hooks/
│   └── useDashboardData.js         # Custom hook cho data management
└── components/
    ├── BadgeComponents.jsx         # Quản lý huy hiệu và achievement
    ├── ProgressTracker.jsx         # Theo dõi tiến trình hút thuốc
    ├── JournalManager.jsx          # Quản lý nhật ký
    ├── ProfileManager.jsx          # Quản lý thông tin cá nhân
    ├── AppointmentManager.jsx      # Quản lý lịch hẹn
    └── NotificationManager.jsx     # Quản lý thông báo
```

### 🧩 Chi tiết các component

#### 1. **dashboard.jsx** (Main Component)
- Component chính điều phối tất cả các tab
- Sử dụng custom hook `useDashboardData` để quản lý state
- Render các tab và điều hướng giữa các chức năng

#### 2. **constants/dashboardConstants.js**
- Chứa tất cả constants như BADGES, TIPS, COMMUNITY_AVG
- Định nghĩa TABS enum
- Configuration cho toàn bộ dashboard

#### 3. **utils/dashboardUtils.js**
- Utility functions như `safeParse`, `getAchievedBadges`
- Notification functions
- Progress calculation functions
- Pure functions không phụ thuộc vào component state

#### 4. **hooks/useDashboardData.js**
- Custom hook quản lý tất cả API calls
- State management cho dashboard data
- Effect hooks cho data fetching
- Tách logic business khỏi UI component

#### 5. **components/BadgeComponents.jsx**
- Hiển thị và quản lý huy hiệu thành tích
- Xử lý chia sẻ huy hiệu
- Comment và encourage system
- Badge notification logic

#### 6. **components/ProgressTracker.jsx**
- Form ghi nhận tiến trình hàng ngày
- Biểu đồ tiến trình (Chart.js)
- Progress circle SVG
- Statistics cards

#### 7. **components/JournalManager.jsx**
- CRUD operations cho nhật ký
- Lọc nhật ký theo tháng
- Export CSV functionality
- Journal entry form

#### 8. **components/ProfileManager.jsx**
- Quản lý thông tin hồ sơ cá nhân
- Form chỉnh sửa profile
- API integration cho member profile
- Validation logic

#### 9. **components/AppointmentManager.jsx**
- Hiển thị danh sách lịch hẹn
- Chat integration với coach
- Coach list management
- Appointment filtering

#### 10. **components/NotificationManager.jsx**
- Notification settings
- Personal tips system
- Browser notification management
- Notification history integration

### 🔄 API Integration

Tất cả API calls được tập trung trong:
- `useDashboardData.js` hook
- Các component riêng lẻ cho CRUD operations
- Không còn duplicate API calls

### 📋 Props Flow

```
Dashboard (Main)
├── useDashboardData() → state & functions
├── BadgeComponents ← progress, achievedBadges, setters
├── ProgressTracker ← progress, logs, plan, setters
├── JournalManager ← journal, progressLogs, setters
├── ProfileManager ← memberProfile, form data, setters
├── AppointmentManager ← appointments, coachList, functions
└── NotificationManager ← progress, plan
```

### 🚀 Lợi ích của cấu trúc mới

1. **Tách biệt concerns**: Mỗi component chỉ lo một chức năng cụ thể
2. **Dễ bảo trì**: Code nhỏ hơn, dễ đọc và debug
3. **Tái sử dụng**: Components có thể được sử dụng ở nơi khác
4. **Testing**: Dễ dàng test từng component riêng lẻ
5. **Performance**: Chỉ re-render component cần thiết
6. **Collaboration**: Team có thể làm việc song song trên các component khác nhau

### 🔧 Cách sử dụng

Dashboard component mới sử dụng hoàn toàn giống như cũ:

```jsx
import Dashboard from './components/dashboard/dashboard';

// Sử dụng bình thường
<Dashboard />
```

### ⚠️ Breaking Changes

- Không có breaking changes
- Tất cả API và functionality giữ nguyên
- Chỉ tách internal structure

### 🐛 Debugging

- Mỗi component có thể debug riêng lẻ
- Console logs được tập trung trong hooks
- Error boundaries có thể được thêm cho từng component

### 📚 Future Improvements

1. Thêm error boundaries cho từng component
2. Implement loading states riêng cho từng section
3. Add unit tests cho từng component
4. Optimize re-rendering với React.memo
5. Add TypeScript types
6. Implement caching cho API calls

### 🔄 Migration Guide

Nếu cần rollback về version cũ:
```bash
cp dashboard.backup.jsx dashboard.jsx
```

File backup được giữ để đảm bảo an toàn.
