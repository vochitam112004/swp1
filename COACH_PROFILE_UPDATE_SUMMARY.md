# Cập nhật Trang Huấn Luyện Viên - Tóm Tắt Thay Đổi

## Mô tả thay đổi
Đã cập nhật trang huấn luyện viên theo yêu cầu:
1. **Chỉ cho phép chỉnh sửa mật khẩu** trong thông tin tài khoản (các thông tin khác chỉ xem)
2. **Chuyển TriggerFactor vào hồ sơ thành viên** thay vì tab riêng

## Các file đã tạo/cập nhật

### 1. Tạo mới: `src/components/profile/tabs/CoachAccountTab.jsx`
- Chỉ cho phép đổi mật khẩu qua OTP
- Các thông tin khác (tên, email, số điện thoại, địa chỉ) chỉ hiển thị dạng read-only
- Giao diện được thiết kế đẹp mắt với Card layout

### 2. Tạo mới: `src/components/profile/tabs/CoachSmokingHabitsTab.jsx`  
- Tích hợp TriggerFactor management vào hồ sơ thành viên
- Bao gồm:
  - Form chỉnh sửa thông tin sức khỏe & thói quen hút thuốc
  - Quản lý TriggerFactor: tạo, gán, sửa, xóa
  - Chọn thành viên để quản lý TriggerFactor
- Giao diện được chia thành 2 phần rõ ràng

### 3. Tạo mới: `src/components/profile/CoachProfileTabs.jsx`
- ProfileTabs riêng cho Coach
- 3 tabs:
  - "Bảo mật tài khoản" (chỉ đổi mật khẩu)  
  - "Hồ sơ thành viên & TriggerFactor" (tích hợp 2in1)
  - "Huy hiệu"

### 4. Cập nhật: `src/components/coach/CoachPage.jsx`
- Thay thế import từ `ProfileTabs` thành `CoachProfileTabs`
- Sử dụng component mới cho tab "Hồ sơ cá nhân"

## Tính năng mới

### Coach Account Tab:
- ✅ Read-only cho tất cả thông tin cá nhân
- ✅ Chỉ cho phép đổi mật khẩu qua OTP
- ✅ Giao diện Card đẹp mắt và dễ nhìn

### Coach Smoking Habits Tab:
- ✅ Quản lý hồ sơ sức khỏe thành viên
- ✅ Tích hợp đầy đủ TriggerFactor management:
  - Tạo yếu tố kích thích mới
  - Gán yếu tố cho thành viên
  - Cập nhật tên yếu tố
  - Xóa yếu tố khỏi thành viên
  - Xóa hoàn toàn yếu tố
- ✅ Autocomplete chọn thành viên
- ✅ Hiển thị danh sách yếu tố của từng thành viên
- ✅ Dialog forms cho các thao tác

## Bảo mật & Quyền hạn
- ✅ Chỉ Coach mới có thể truy cập các tính năng này
- ✅ Kiểm tra quyền hạn theo role-based system
- ✅ Validation đầy đủ cho tất cả form

## UI/UX Improvements
- ✅ Giao diện nhất quán với Material-UI
- ✅ Loading states và error handling
- ✅ Toast notifications cho feedback
- ✅ Icons và colors phù hợp
- ✅ Responsive design

## Cách sử dụng
1. Đăng nhập với tài khoản Coach
2. Vào "Trang huấn luyện viên"
3. Chọn tab "Hồ sơ cá nhân"
4. Sẽ thấy:
   - Tab "Bảo mật tài khoản": Chỉ đổi mật khẩu
   - Tab "Hồ sơ thành viên & TriggerFactor": Quản lý hồ sơ + TriggerFactor
   - Tab "Huy hiệu": Hiển thị huy hiệu

## Test thử
Server đang chạy tại: http://localhost:5174/
- Đăng nhập với tài khoản Coach
- Truy cập trang huấn luyện viên để test các tính năng mới
