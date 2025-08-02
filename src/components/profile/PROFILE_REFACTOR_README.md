# Profile Refactoring Summary

## Thay đổi thực hiện

### 1. Gộp hai trang Profile thành một
- **Trước**: Có 2 trang profile riêng biệt
  - `/profile` - Trang thông tin cá nhân (Profile.jsx)
  - Dashboard tab "Hồ sơ cá nhân" - ProfileManager.jsx
- **Sau**: Chỉ có 1 trang profile duy nhất `/profile` với tab navigation

### 2. Cấu trúc mới của ProfileTabs
```
ProfileTabs.jsx (Main component)
├── AccountTab.jsx (Thông tin tài khoản)
├── SmokingHabitsTab.jsx (Thông tin hút thuốc)
├── HealthTab.jsx (Thông tin sức khỏe)
└── BadgesTab.jsx (Huy hiệu & Thành viên)
```

### 3. Các file được tạo mới
- `src/components/profile/ProfileTabs.jsx`
- `src/components/profile/tabs/AccountTab.jsx`
- `src/components/profile/tabs/SmokingHabitsTab.jsx`
- `src/components/profile/tabs/HealthTab.jsx`
- `src/components/profile/tabs/BadgesTab.jsx`
- `src/css/ProfileTabs.css`

### 4. Các file được sửa đổi
- `src/App.jsx` - Cập nhật route `/profile` sử dụng ProfileTabs
- `src/components/coach/CoachPage.jsx` - Sử dụng ProfileTabs thay vì Profile
- `src/components/dashboard/dashboard.jsx` - Loại bỏ ProfileManager tab

### 5. Các file được backup
- `src/components/profile/Profile_backup.jsx` - Backup của Profile.jsx cũ

### 6. Chức năng của từng tab

#### Tab 1: Thông tin tài khoản
- Thông tin cơ bản (username, email, phone, address)
- Đổi avatar
- Đổi mật khẩu với OTP

#### Tab 2: Thông tin hút thuốc (chỉ dành cho Member)
- Tình trạng hút thuốc
- Số lần cai thuốc
- Thói quen hút thuốc chi tiết
- Thống kê chi phí

#### Tab 3: Thông tin sức khỏe (chỉ dành cho Member)
- Tình trạng sức khỏe
- Dị ứng
- Thuốc đang sử dụng
- Vấn đề sức khỏe do hút thuốc

#### Tab 4: Huy hiệu & Thành viên (chỉ dành cho Member)
- Huy hiệu đã đạt được
- Lịch sử gói thành viên
- Thống kê thành tích

### 7. Lợi ích của việc refactor
- ✅ Loại bỏ sự trùng lặp thông tin
- ✅ Giao diện nhất quán và dễ sử dụng
- ✅ Dễ bảo trì và phát triển
- ✅ UX tốt hơn với tab navigation
- ✅ Responsive design

### 8. Cách truy cập
- **URL**: `/profile`
- **Navigation**: Click vào avatar → "Xem hồ sơ"
- **Quyền truy cập**: Tất cả user đã đăng nhập

### 9. Notes
- ProfileManager.jsx vẫn tồn tại nhưng không được sử dụng
- useDashboardData hook giữ nguyên để không ảnh hưởng đến các component khác
- Profile.jsx cũ được backup thành Profile_backup.jsx
