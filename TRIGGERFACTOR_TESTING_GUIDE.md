# TriggerFactor API Testing Guide

## Để test TriggerFactor API đã cập nhật

### 1. Khởi chạy ứng dụng
```bash
npm run dev
```
Ứng dụng sẽ chạy tại: http://localhost:5174

### 2. Truy cập trang test
- Vào URL: `http://localhost:5174/#/debug`
- Chọn tab **"TriggerFactor API Test"**

### 3. Test các chức năng

#### A. Test tạo TriggerFactor mới
1. Nhập tên trigger factor (ví dụ: "Stress test")
2. Click **"Chỉ Tạo"** để tạo không gán cho user
3. Click **"Tạo & Gán Cho Tôi"** để tạo và gán luôn

#### B. Test gán TriggerFactor
1. Trong danh sách "Tất Cả Yếu Tố Kích Thích"  
2. Click **"Gán cho tôi"** cho các trigger chưa có

#### C. Test cập nhật TriggerFactor
1. Click icon ✏️ (Edit) bên cạnh trigger factor
2. Sửa tên mới
3. Click **"Lưu"**

#### D. Test xóa TriggerFactor
1. **Xóa khỏi user**: Click icon 🗑️ trong danh sách "Của Tôi"
2. **Xóa hoàn toàn**: Click icon 🗑️ trong danh sách "Tất Cả"

### 4. Test trong Profile
- Vào **Profile** → Tab **"Thói quen hút thuốc"**
- Test thêm/xóa trigger factors trong profile real

### 5. Kiểm tra Console Logs
- Mở DevTools → Console
- Xem logs chi tiết cho mỗi API call:
  - ✅ Success logs
  - ❌ Error logs  
  - 🔄 Loading logs

### 6. Expected Swagger API Calls

| Chức năng | HTTP Method | Endpoint |
|-----------|-------------|----------|
| Lấy tất cả | GET | `/api/TriggerFactor/GetAllTriggerFactor` |
| Lấy của tôi | GET | `/api/TriggerFactor/Get-MyTriggerFactor` |
| Tạo mới | POST | `/api/TriggerFactor/Create-TriggerFactor` |
| Cập nhật | PUT | `/api/TriggerFactor/Update-TriggerFactor/{id}` |
| Xóa khỏi user | DELETE | `/api/TriggerFactor/removeTriggerFactorAtMember/{triggerId}` |
| Gán cho user | POST | `/api/TriggerFactor/assign` |
| Xóa hoàn toàn | DELETE | `/api/TriggerFactor/Delete-TriggerFactor/{id}` |

### 7. Test Cases Quan Trọng

1. **Happy Path**: Tạo → Gán → Cập nhật → Xóa
2. **Error Handling**: Test với tên rỗng, ID không tồn tại
3. **Concurrent**: Test nhiều actions cùng lúc
4. **Refresh**: Test refresh data sau mỗi action
5. **Authentication**: Đảm bảo có token trong headers

### 8. Troubleshooting

#### Nếu gặp lỗi 404:
- Kiểm tra backend có đang chạy không
- Kiểm tra base URL in `src/api/axios.js`

#### Nếu gặp lỗi Authentication:
- Login lại
- Kiểm tra token trong localStorage

#### Nếu data không update:
- Click **🔄 Refresh** 
- Check console logs
- Kiểm tra API response format

### 9. Files được cập nhật

- ✅ `src/api/triggerFactorService.js` - Service chính
- ✅ `src/utils/apiHelper.js` - Helper functions  
- ✅ `src/components/profile/tabs/SmokingHabitsTab.jsx` - Profile integration
- ✅ `src/components/debug/TriggerFactorTest.jsx` - Test component
- ✅ `src/pages/DebugPage.jsx` - Debug page với tabs

Tất cả đã được update theo Swagger specification mới! 🎉
